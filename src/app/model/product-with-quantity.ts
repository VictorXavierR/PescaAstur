import { Product } from "./product";

export class ProductWithQuantity {

    quantity: number;
    product: Product;

    constructor(){
        this.quantity = 0;
        this.product = new Product();
    }
}
