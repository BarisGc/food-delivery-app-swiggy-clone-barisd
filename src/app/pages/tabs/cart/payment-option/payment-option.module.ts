import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentOptionPageRoutingModule } from './payment-option-routing.module';

import { PaymentOptionPage } from './payment-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentOptionPageRoutingModule
  ],
  declarations: [PaymentOptionPage]
})
export class PaymentOptionPageModule {}
