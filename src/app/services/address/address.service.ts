import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
import { Address } from 'src/app/models/address.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  // uid: string;

  private _addresses = new BehaviorSubject<Address[]>([]);
  private _addressChange = new BehaviorSubject<Address>(null);

  get addresses() {
    return this._addresses.asObservable();
  }
  get addressChange() {
    return this._addressChange.asObservable();
  }

  constructor(private auth: AuthService, private api: ApiService) { }

  async getUid() {
    return await this.auth.getId();
  }

  // async getAddressRef(query?) {
  //   if(!this.uid) this.uid = await this.getUid();
  //   return await this.api.collection('address').doc(this.uid).collection('all', query);
  // }

  async getAddresses(limit?) {
    try {
      // let addressRef;
      // if(limit) addressRef = await this.getAddressRef(ref => ref.limit(limit));
      // else addressRef = await this.getAddressRef();
      // const allAddress: Address[] = await addressRef.get().pipe(
      //   switchMap(async(data: any) => {
      //     let itemData = await data.docs.map(element => {
      //       let item = element.data();
      //       item.id = element.id;
      //       return item;
      //     });
      //     console.log(itemData);
      //     return itemData;
      //   })
      // )
      // .toPromise(); 
      const uid = await this.getUid();
      const queryData = this.api.limitQuery(limit);
      let querySnapshot;
      if(limit) querySnapshot = await this.api.getDocs(`address/${uid}/all`, queryData);
      else querySnapshot = await this.api.getDocs(`address/${uid}/all`);
      const allAddress = await querySnapshot.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log(allAddress);
      this._addresses.next(allAddress);
      return allAddress;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async addAddress(param) {
    try {      
      const uid = await this.getUid();
      const currentAddresses = this._addresses.value;
      const data = new Address(
        uid,
        param.title,
        param.address,
        param.landmark,
        param.house,
        param.lat,
        param.lng
      );
      let addressData = Object.assign({}, data);
      delete addressData.id;
      // const response = await (await this.getAddressRef()).add(addressData);
      const response = await this.api.addDocument(`address/${uid}/all`, addressData);
      console.log(response);
      const id = await response.id;
      const address = {...addressData, id};
      currentAddresses.push(address);
      this._addresses.next(currentAddresses);
      this._addressChange.next(address);
      return address;
    } catch(e) {
      throw(e);
    }
  }

  async updateAddress(id, param, uid?) {
    try {
      if(!uid) uid = await this.getUid();
      // await (await this.getAddressRef()).doc(id).update(param);
      await this.api.updateDocument(`address/${uid}/all/${id}`, param);
      let currentAddresses = this._addresses.value;
      const index = currentAddresses.findIndex(x => x.id == id);
      const data = new Address(
        // param.user_id,
        uid,
        param.title,
        param.address,
        param.landmark,
        param.house,
        param.lat,
        param.lng,
        id,
      );
      currentAddresses[index] = data;
      this._addresses.next(currentAddresses);
      console.log('check data: ', data);
      this._addressChange.next(data);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async deleteAddress(param) {
    try {
      const uid = await this.getUid();
      // await (await this.getAddressRef()).doc(param.id).delete();
      await this.api.deleteDocument(`address/${uid}/all/${param.id}`);
      let currentAddresses = this._addresses.value;
      currentAddresses = currentAddresses.filter(x => x.id != param.id);
      this._addresses.next(currentAddresses);
      return currentAddresses;
    } catch(e) {
      throw(e);
    }
  }

  changeAddress(address) {
    this._addressChange.next(address);
  }

  async checkExistAddress(location) {
    try { 
      console.log('check exist address: ', location);     
      let loc: Address = location;
      // const addresses: Address[] = await (await this.getAddressRef(
      //   ref => ref.where('lat', '==', location.lat).where('lng', '==', location.lng)
      //   )).get().pipe(
      //     switchMap(async(data: any) => {
      //       let itemData = await data.docs.map(element => {
      //         let item = element.data();
      //         item.id = element.id;
      //         return item;
      //       });
      //       console.log(itemData);
      //       return itemData;
      //     })
      //   )
      //   .toPromise();
      const uid = await this.getUid();
      const queryData = [
        this.api.whereQuery('lat', '==', location.lat),
        this.api.whereQuery('lng', '==', location.lng)
      ];
      const querySnapshot = await this.api.getDocs(`address/${uid}/all`, ...queryData);
      const addresses = await querySnapshot.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log('addresses: ', addresses);
      if(addresses?.length > 0) {
        loc = addresses[0];
      }
      console.log('loc: ', loc);
      this.changeAddress(loc);
      return loc;
    } catch(e) {
      throw(e);
    }
  }
 
}
