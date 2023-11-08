import { lastValueFrom } from 'rxjs';
import { HttpService } from './../http/http.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Checkout } from 'capacitor-razorpay';

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  constructor(private http: HttpService) { }

  async createRazorpayOrder(param) {
    try {
      const data$ = this.http.post(
        environment.firebaseApiUrl + 'createOrder', 
        param
      );
      // const data = await (data$).toPromise();
      const data = await lastValueFrom(data$);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async payWithRazorpay(param) {
    try {
      const options = {
        key: environment.razorpay.key_id,
        amount: (param.amount).toString(),
        image: '../../assets/imgs/logo.png',
        currency: 'INR',
        name: 'Maza Eats', 
        prefill: { 
          email: param.email, 
          contact: param.phone
        },
        theme: {
          color: '#de0f17'
        }
      };
      const data = await Checkout.open(options);
      console.log(data.response);
      return data.response;
    } catch(e) {
      throw(e);
    }
  }
}
