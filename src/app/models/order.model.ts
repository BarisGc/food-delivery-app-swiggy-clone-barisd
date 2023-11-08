import { Address } from "./address.model";
import { Item } from "./item.model";
import { Restaurant } from "./restaurant.model";

export class Order {
    constructor(
        public address: Address,
        public restaurant: Restaurant,
        public user: any,
        public restaurant_id: string,
        public order: Item[],
        public total: number,
        public grandTotal: number,
        public deliveryCharge: number,
        public status: string,
        public time: string,
        public paid: string,
        public id?: string,
        public uid?: string,
        public instruction?: string,
        public payment_id?: string
    ) {}
}