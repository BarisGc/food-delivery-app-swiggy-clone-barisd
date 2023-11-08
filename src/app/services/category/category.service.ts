import { Injectable } from '@angular/core';
// import { switchMap } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private api: ApiService
  ) { }

  // categories
  async getRestaurantCategories(uid) {
    try {
      // const categories = await this.api.collection(
      //   'categories',
      //   ref => ref.where('uid', '==', uid)
      // ).get().pipe(
      //   switchMap(async(data: any) => {
      //     let categoryData = await data.docs.map(element => {
      //       let item = element.data();
      //       item.id = element.id;
      //       return item;
      //     });
      //     console.log(categoryData);
      //     return categoryData;
      //   })
      // ).toPromise();
      const query = this.api.whereQuery('uid', '==', uid);
      const querySnapshot = await this.api.getDocs('categories', query);
      const categories = await querySnapshot.docs.map(doc => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log(categories);
      return categories;
    } catch(e) {
      throw(e);
    }
  }

  async addCategories(categories, uid) {
    try {
      categories.forEach(async(element) => {
        // const id = this.api.randomString();
        const data = new Category(
          element,
          uid
        );
        delete data.id;
        // const result = await this.api.collection('categories').doc(id).set(Object.assign({}, data));        
        // const result = await this.api.collection('categories').add(Object.assign({}, data));
        const result = await this.api.addDocument('categories', Object.assign({}, data));
      });
      return true;
    } catch(e) {
      throw(e);
    }
  }
}
