import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';
import { Banner } from 'src/app/models/banner.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { BannerService } from 'src/app/services/banner/banner.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  banners: Banner[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub!: Subscription;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private global: GlobalService,
    private locationService: LocationService,
    private mapService: GoogleMapsService,
    private restaurantService: RestaurantService,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe({
      next: address => {
        console.log('address', address);
        if(address && address?.lat) {
          if(!this.isLoading) this.isLoading = true;
          this.location = address;
          // this.nearbyApiCall(address.lat, address.lng);
          this.nearbyApiCall();
        } else {
          if(address && (!this.location || !this.location?.lat)) {
            this.searchLocation('home', 'home-modal');
          }
        }
      }, 
      error: e => {
        console.log(e);
        this.isLoading = false; 
        this.global.errorToast();
      }
    });
    this.isLoading = true;
    this.getBanners();
    if(!this.location?.lat) {
      this.getNearbyRestaurants();
    }   
  }

  getBanners() {
    this.bannerService.getBanners().then(data => {
      console.log('banners: ', data);
      this.banners = data;
    })
    .catch(e => {
      console.log(e);
    })
  }

  async nearbyApiCall() {
    try {
      console.log(this.location);
      this.restaurants = await this.restaurantService.getNearbyRestaurants(this.location.lat, this.location.lng);
      console.log(this.restaurants);
      this.isLoading = false;
    } catch(e) {
      // set isLoading to false
      console.log(e);
      this.global.errorToast();
    }
  }

  async getNearbyRestaurants() {
    try {
      const position = await this.locationService.getCurrentLocation();
      console.log('get nearby restaurants', position);
      const { latitude, longitude } = position.coords;
      const address = await this.mapService.getAddress(latitude, longitude);
      if(address) {
        this.location = new Address(
          '',
          address.address_components[0].short_name,
          address.formatted_address,
          '',
          '',
          latitude,
          longitude
        );
        await this.getData();
      }
      console.log('restaurants: ', this.restaurants);
      this.isLoading = false;
    } catch(e) {
      console.log(e);
      this.isLoading = false;
      this.searchLocation('home', 'home-modal');
    }
  }

  async getData() {
    try {
      this.restaurants = [];
      await this.addressService.checkExistAddress(this.location);
    } catch(e) {
      console.log(e);
      this.global.errorToast();
    }
  }

  async searchLocation(prop, className?) {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: className ? className : '',
        backdropDismiss: prop == 'select-place' ? true : false,
        componentProps: {
          from: prop
        }
      };
      const modal = await this.global.createModal(options);
      console.log('modal value: ', modal);
      if(modal) {
        if(modal == 'add') {
          this.addAddress(this.location);
        } else if(modal == 'select') {
          this.searchLocation('select-place');
        } else {
          this.location = modal;
          await this.getData();
        }
      } else {
        console.log('location value: ', this.location);
        if(!this.location || !this.location?.lat) {
          this.searchLocation('home', 'home-modal');
        }
      }
    } catch(e) {
      console.log(e);
    }
  }

  addAddress(val?) {
    let navData: NavigationExtras;
    if(val) {
      val.from = 'home';      
    } else {
      val = {
        from: 'home'
      };
    }
    navData = {
      queryParams: {
        data: JSON.stringify(val)
      }
    }
    this.router.navigate(['/', 'tabs', 'address', 'edit-address'], navData);
  }

  ngOnDestroy() {
    if(this.addressSub) this.addressSub.unsubscribe();
  }

}