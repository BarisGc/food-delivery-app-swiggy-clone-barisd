import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Banner } from 'src/app/models/banner.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private api: ApiService
  ) { }  

  // banner apis
  async addBanner(data) {
    try {
      // const id = this.api.randomString();
      // data.id = id;
      const bannerData = new Banner(
        data.banner, 
        data.status
      );
      let banner = Object.assign({}, bannerData);
      delete banner.res_id;
      delete banner.id;
      // await this.api.collection('banners').doc(id).set(banner);
      const response = await this.api.addDocument('banners', banner);
      // console.log(response.id);
      return true;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async getBanners() {
    try {
      // const banners: Banner[] = await this.api.collection('banners').get().pipe(
      //   switchMap(async(data: any) => {
      //     let bannerData = await data.docs.map(element => {
      //       const item = element.data();
      //       return item;
      //     });
      //     console.log(bannerData);
      //     return bannerData;
      //   })
      // ).toPromise();
      const querySnapshot = await this.api.getDocs('banners');
      const banners = await querySnapshot.docs.map(doc => {
        let item = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log(banners);
      return banners;
    } catch(e) {
      throw(e);
    }
  }
}
