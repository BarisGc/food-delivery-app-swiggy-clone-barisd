import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { Banner } from 'src/app/models/banner.model';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent  implements OnInit {

  swiperModules = [IonicSlides];
  @Input() bannerImages: Banner[];

  constructor(private router: Router) { }

  ngOnInit() {}

  goToRestaurant(data) {
    console.log(data);
    if(data?.res_id) {
      this.router.navigate(['/', 'tabs', 'restaurants', data.res_id]);
    }
  }

}
