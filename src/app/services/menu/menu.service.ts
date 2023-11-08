import { Injectable } from '@angular/core';
// import { switchMap } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private api: ApiService
  ) { }

  // menu
  async addMenuItem(data) {
    try {
      const id = this.api.randomString();
      const item = new Item(
        id,
        data.restaurant_id,
        // this.api.firestoreDB.collection('categories').doc(data.category_id),
        this.api.document(`categories/${data.category_id}`),
        data.cover,
        data.name,
        data.description,
        data.price,
        data.veg,
        data.status,
        false,
        0
      );
      let itemData = Object.assign({}, item);
      delete itemData.quantity;
      console.log(itemData);
      // const result = await this.api.collection('menu').doc(data.restaurant_id).collection('allItems').doc(id).set(itemData);
      const result = await this.api.setDocument(`menu/${data.restaurant_id}/allItems/${id}`, itemData);
      return true;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurantMenu(uid) {
    try {
      // const itemsRef = await this.api.collection('menu').doc(uid)
      //     .collection('allItems', ref => ref.where('status', '==', true));
      // const items = itemsRef.get().pipe(
      //   switchMap(async(data: any) => {
      //     let itemData = await data.docs.map(element => {
      //       let item = element.data();
      //       item.category_id.get()
      //       .then(cData => {
                // let category_data: any = cData.data();
                  // category_data.id = cData.id;
                  // item.category_id = category_data;
             // // item.category_id = cData.data();
      //       })
      //       .catch(e => { throw(e); });
      //       return item;
      //     });
      //     console.log(itemData);
      //     return itemData;
      //   })
      // )
      // .toPromise();
      const query = this.api.whereQuery('status', '==', true);
      const querySnapshot = await this.api.getDocs(`menu/${uid}/allItems`, query);
      const items: Item[] = await querySnapshot.docs.map(doc => {
        let data = doc.data();
        data.id = doc.id;
        this.api.getDocByReference(data.category_id).then(docSnap => {
          if(docSnap?.exists()) {
            let category_data: any = docSnap.data();
            category_data.id = docSnap.id;
            data.category_id = category_data;
            // data.category_id = docSnap.data();
            // data.category_id.id = docSnap.id;
          } else {
            throw('No such document exist');
          }
        });
        return data;
      });
      console.log(items);
      return items;
    } catch(e) {
      throw(e);
    }
  }
}
