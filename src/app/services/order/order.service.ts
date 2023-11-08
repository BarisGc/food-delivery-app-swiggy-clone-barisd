import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uid: string;

  private _orders = new BehaviorSubject<Order[]>([]);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(private auth: AuthService, private api: ApiService) { }

  getRadius() {
    return this.api.radius;
  }

  async getUid() {
    if(!this.uid) return await this.auth.getId();
    else return this.uid;
  }

  // async getOrderRef() {
  //   this.uid = await this.getUid();
  //   return this.api.collection('orders').doc(this.uid).collection('all');
  // }

  async getOrders() {
    try {
      // const orders: Order[] = await (await this.getOrderRef()).get().pipe(
      //   switchMap(async(data: any) => {
      //     let itemData = await data.docs.map(element => {
      //       let item = element.data();
      //       item.id = element.id;
      //       item.order = JSON.parse(item.order);
      //       item.restaurant.get()
      //       .then(rData => {
      //         item.restaurant = rData.data();
      //       })
      //       .catch(e => { throw(e); });
      //       return item;
      //     });
      //     console.log(itemData);
      //     return itemData;
      //   })
      // )
      // .toPromise(); 
      this.uid = await this.getUid();
      const query = this.api.whereQuery('uid', '==', this.uid);
      const querySnapshot = await this.api.getDocs('orders', query);
      const orders = await querySnapshot.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        item.order = JSON.parse(item.order);
        this.api.getDocByReference(item.restaurant).then(docRestaurantSnap => {
          if(docRestaurantSnap?.exists()) {
            item.restaurant = docRestaurantSnap.data();
          } else {
            throw('No restaurant document exists');
          }
        });
        return item;
      });
      console.log('orders', orders);
      this._orders.next(orders);
      return orders;
    } catch(e) {
      throw(e);
    }
  }

  async placeOrder(param) {
    try {
      const uid = await this.getUid();
      const order = JSON.stringify(param.order);
      // const restaurant = await this.api.firestoreDB.collection('restaurants').doc(param.restaurant_id);
      const restaurant = this.api.document(`restaurants/${param.restaurant_id}`);
      const user = this.api.document(`users/${uid}`);
      const data = {...param, address: Object.assign({}, param.address), order, restaurant, uid, user};
      // const orderRef = await (await this.getOrderRef()).add(data);
      const orderRef = await this.api.addDocument('orders', data);
      const order_id = await orderRef.id;
      console.log('latest order: ', param);
      let currentOrders: Order[] = [];
      currentOrders.push(new Order(
        param.address,
        param.restaurant,
        user,
        param.restaurant_id,
        param.order,
        param.total,
        param.grandTotal,
        param.deliveryCharge,
        param.status,
        param.time,
        param.paid,    
        order_id,
        uid,
        param.instruction,
        param?.payment_id ? param.payment_id : null
      ));

      console.log('latest order: ', currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log('orders: ', currentOrders);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch(e) {
      throw(e);
    }
  }

  reset() {
    this.uid = null;
  }

}
