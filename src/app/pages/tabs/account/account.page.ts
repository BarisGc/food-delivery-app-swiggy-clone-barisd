import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { Strings } from 'src/app/enum/strings.enum';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {

  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;
  profileSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private orderService: OrderService,
    private cartService: CartService,
    private global: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe({
      next: order => {
        console.log('order data: ', order);
        this.orders = order;
      }, 
      error: e => {
        console.log(e);
      }
    });
    this.profileSub = this.profileService.profile.subscribe({
      next: profile => {
        this.profile = profile;
        console.log(this.profile);
      }
    });
    this.getData();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AccountPage');
    this.global.customStatusbar(true);
  }

  async getData() {
    try {
      this.isLoading = true;
      await this.profileService.getProfile();
      await this.orderService.getOrders();
      this.isLoading = false; 
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      this.global.errorToast();
    }
  }

  confirmLogout() {
    this.global.showAlert(
      'Are you sure you want to sign-out?',
      'Confirm',
      [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.logout();
        }
      }]
    );
  }

  logout() {
    this.global.showLoader();
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot(Strings.LOGIN);
      this.global.hideLoader();
    })
    .catch(e => {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast('Logout Failed! Check your internet connection');
    });
  }

  async reorder(order: Order) {
    console.log(order);
    let data = await this.cartService.getCart();
    console.log('data: ', data);
    if(data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }

  getHelp(order) {
    console.log(order);
  }

  async editProfile() {
    const options = {
      component: EditProfileComponent,
      componentProps: {
        profile: this.profile
      },
      // cssClass: 'custom-modal',
      // swipeToClose: true,
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    };
    const modal = await this.global.createModal(options);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave AccountPage');
    this.global.customStatusbar();
  }

  ngOnDestroy() {
    if(this.ordersSub) this.ordersSub.unsubscribe();
    if(this.profileSub) this.profileSub.unsubscribe();
    this.orderService.reset();
  }

}
