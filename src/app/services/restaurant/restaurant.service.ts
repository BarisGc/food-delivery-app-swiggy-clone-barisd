import { Injectable } from '@angular/core';
// import { switchMap } from 'rxjs/operators';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(
    private api: ApiService
  ) { }

  async addRestaurant(data: any, uid) {
    try {
      let restaurant = Object.assign({}, data);
      delete restaurant.g;
      delete restaurant.distance;
      console.log(restaurant);
      const response = await this.api.geoCollection('restaurants').doc(uid).set(restaurant);
      return response;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurants() {
    try {
      // const restaurants = await this.api.collection('restaurants').get().pipe(
      //   switchMap(async(data: any) => {
      //     let restaurantData = await data.docs.map(element => {
      //       const item = element.data();
      //       return item;
      //     });
      //     console.log(restaurantData);
      //     return restaurantData;
      //   })
      // ).toPromise();
      const querySnapshot = await this.api.getDocs('restaurants');
      const restaurants = await querySnapshot.docs.map((doc: any) => {
        return doc.data();
      });
      console.log(restaurants);
      return restaurants;
    } catch(e) {
      throw(e);
    }
  }

  async getRestaurantById(id): Promise<any> {
    try {
      // const restaurant = (await (this.api.collection('restaurants').doc(id).get().toPromise())).data();
      let restaurant: Restaurant;
      const docSnap: any = await this.api.getDocById(`restaurants/${id}`);
      if(docSnap?.exists()) {
        restaurant = docSnap.data();
      } else {
        throw('No such document exists!');
      }
      console.log(restaurant);
      return restaurant;
    } catch(e) {
      throw(e);
    }
  }

  async getNearbyRestaurants(lat, lng): Promise<any> {
    try {
      const center = await this.api.getGeoPoint(lat, lng);
      const radius = this.api.radius;
      const data = await (await this.api.geoCollection('restaurants').near({ center, radius })
      .get()).docs.sort((a, b) => a.distance - b.distance).map(element => {
        let item = element.data();
        item['id'] = element.id;
        item['distance'] = element.distance;
        return item;
      });
      return data;
    } catch(e) {
      throw(e);
    }
  }
}
