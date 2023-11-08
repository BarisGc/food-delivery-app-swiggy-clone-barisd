import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import * as geofirestore from 'geofirestore';
import { 
  addDoc, collection, collectionData, deleteDoc, doc, endAt, 
  Firestore, getDoc, getDocs, limit, orderBy, query, setDoc, 
  startAt, updateDoc, where 
} from '@angular/fire/firestore';
import { GeoPoint, getFirestore } from 'firebase/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  radius = 20;// in km
  firestoreDB: any = firebase.firestore();
  db = getFirestore();
  GeoFirestore = geofirestore.initializeApp(this.firestoreDB);

  constructor(
    private adb: AngularFirestore,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  getGeoPoint(lat, lng) {
    return new GeoPoint(lat, lng);
  }

  collectionRef(path) {
    return collection(this.firestore, path);
  }

  docRef(path) {
    return doc(this.firestore, path);
  }

  document(path) {
    return doc(this.db, path);
  }

  collectionDataQuery(path, id?) {
    let dataRef = this.collectionRef(path);
    let collection_data;
    if(id) collection_data = collectionData<any>(dataRef, {idField: 'id'});
    else collection_data = collectionData<any>(dataRef); //valuechanges, for doc use docData
    return collection_data;
  }

  getDocs(path, queryFn?) {
    let dataRef: any = this.collectionRef(path);
    if(queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs<any>(dataRef); //get()
  }

  searchRestaurantByName(start, end) {
    let dataRef: any = this.collectionRef('restaurants');
    const q = query(
      dataRef,
      orderBy('short_name'),
      startAt(start),
      endAt(end)
    );
    return getDocs<any>(q);
  }

  getDocById(path) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  getDocByReference(dataRef) {
    return getDoc(dataRef);
  }

  addDocument(path, data) {
    const dataRef = this.collectionRef(path);
    return addDoc<any>(dataRef, data); //add()
  }

  setDocument(path, data) {
    const dataRef = this.docRef(path);
    return setDoc<any>(dataRef, data); //set()
  }

  updateDocument(path, data) {
    const dataRef = this.docRef(path);
    return updateDoc<any>(dataRef, data); //update()
  }

  deleteDocument(path) {
    const dataRef = this.docRef(path);;
    return deleteDoc(dataRef); //delete()
  }

  limitQuery(number) {
    return limit(number);
  }

  whereQuery(fieldPath, condition, value) {
    return where(fieldPath, condition, value);
  }

  async uploadImage(file, filePath) {
    try {
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, file);
      const url = getDownloadURL(fileRef);
      return url;
    } catch(e) {
      throw(e);
    }
  }

  // collection(path, queryFn?) {
  //   return this.adb.collection(path, queryFn);
  // }

  geoCollection(path) {
    return this.GeoFirestore.collection(path);
  }

  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  // city apis
  async getCities() {
    try {
      // const cities = await this.collection('cities').get().pipe(
      //   switchMap(async(data: any) => {
      //     let cityData = await data.docs.map(element => {
      //       let item = element.data();
      //       item.uid = element.id;
      //       return item;
      //     });
      //     console.log(cityData);
      //     return cityData;
      //   })
      // ).toPromise();
      const querySnapshot = await this.getDocs('cities');
      const cities = await querySnapshot.docs.map(doc => {
        let item = doc.data();
        item.uid = doc.id;
        return item;
      });
      console.log(cities);
      return cities;
    } catch(e) {
      throw(e);
    }
  }

}