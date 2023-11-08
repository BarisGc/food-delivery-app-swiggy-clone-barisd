import { StripeService } from './../../../../services/stripe/stripe.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { RazorpayService } from 'src/app/services/razorpay/razorpay.service';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.page.html',
  styleUrls: ['./payment-option.page.scss'],
})
export class PaymentOptionPage implements OnInit, OnDestroy {

  url: any;
  urlCheck: any;
  profile = {} as User;
  order = {} as Order;
  profileSub: Subscription;

  constructor(
    public router: Router,
    private profileService: ProfileService,
    private cartService: CartService,
    private orderService: OrderService,
    private global: GlobalService,
    private razorpay: RazorpayService,
    private stripe: StripeService
  ) { }

  async ngOnInit() {
    await this.getData();
    this.profileSub = this.profileService.profile.subscribe({
      next: profile => {
        console.log(profile);
        this.profile = profile;
      }
    });
  }

  async getData() {
    try {
      await this.checkUrl();
      await this.profileService.getProfile();
      const order = await this.cartService.getCartOrder();
      console.log(order);
      this.order = JSON.parse(order?.value);
    } catch(e) {
      console.log(e);
      this.global.errorToast();
    }
  }

  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log('urlcheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join('/');
  }

  async payWithRazorpay() {
    try {
      this.global.showLoader();
      const razorpay_data = {
        amount: this.order.grandTotal * 100,
        currency: 'INR'
      };
      const order_data = await this.razorpay.createRazorpayOrder(razorpay_data);
      console.log('order data: ', order_data);
      const param = {
        email: this.profile.email,
        phone: this.profile.phone,
        // amount: this.order.grandTotal * 100
        amount: 100,
        order_id: order_data.id
      };
      this.global.hideLoader();
      const data: any = await this.razorpay.payWithRazorpay(param);      
      console.log(data?.razorpay_payment_id);
      const order_param = {
        paid: 'Razorpay',
        payment_id: data?.razorpay_payment_id
      };
      await this.placeOrder(order_param);
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast(e?.message);
    }
  }

  async payWithStripe() {
    try {
      this.global.showLoader();
      // const profile = await this.profileService.getProfile();
      console.log('profile: ', this.profile);
      const stripe_data = {
        name: this.profile?.name,
        email: this.profile?.email,
        // amount: 1 * 100,
        amount: this.order?.grandTotal * 100,
        currency: 'inr'
      };
      const payment_description = await this.stripe.paymentFlow(stripe_data);
      console.log(payment_description);
      const payment_desc = payment_description.split('_').slice(0, 2).join('_');
      const order_param = {
        paid: 'Stripe',
        payment_id: payment_desc
      };
      this.global.hideLoader();
      await this.placeOrder(order_param);
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast(e?.message);
    }
  }

  async placeOrder(param?) {
    try {
      this.global.showLoader();
      const order = {
        ...this.order,
        ...param
      };
      await this.orderService.placeOrder(order);
      // clear cart
      await this.cartService.clearCart();
      this.global.hideLoader();
      this.global.successToast('Your Order is Placed Successfully');
      this.router.navigateByUrl('/tabs/account');
    } catch(e) {
      console.log(e);
      this.global.hideLoader();
      this.global.errorToast();
    }
  }

  async ngOnDestroy() {
    await this.cartService.clearCartOrder();
    if(this.profileSub) this.profileSub.unsubscribe();
  }

}
