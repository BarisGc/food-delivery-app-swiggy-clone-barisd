import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  @Input() order: Order;
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() help: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  reorderItem() {
    this.reorder.emit(this.order);
  }

  getHelp() {
    this.help.emit(this.order);
  }

}
