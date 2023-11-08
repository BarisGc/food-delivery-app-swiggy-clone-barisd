export class Item {
    
    constructor(
        public id: string,
        public uid: string,
        public category_id: any,
        public cover: string,
        public name: string,
        public desc: string,
        public price: number,
        public veg: boolean,
        public status: boolean,
        public variation: boolean,
        public rating: number,
        public quantity?: number
    ) {}

}