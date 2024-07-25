import { Injectable } from '@angular/core';
import { ProductWithQuantity } from '../model/product-with-quantity';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  shoppingCart: ProductWithQuantity[] = [];
  
  constructor() { }

   /**
   * Add a product to the shopping cart
   */
   addProductToCart(product: Product, quantity: number){
    const productWithQuantity: ProductWithQuantity = { product, quantity };
    this.shoppingCart.push(productWithQuantity);
  }
  /**
   * 
   * @returns the shopping cart
   */
  getShoppingCart(){
    return this.shoppingCart;
  }
  /**
   * Remove a product from the shopping cart
   */
  deleteProductFromCart(product: Product){
    const productEliminated : ProductWithQuantity = this.shoppingCart.filter(p => p.product === product)[0];
    const index = this.shoppingCart.indexOf(productEliminated);
    this.shoppingCart.splice(index, 1);
  }
  /**
   * Reduce the quantity of a product in the shopping cart
   */
  reduceQuantity(product: Product){
    const productReduced : ProductWithQuantity = this.shoppingCart.filter(p => p.product === product)[0];
    this.shoppingCart.filter(p => p.product === product)[0].quantity--;
    if(productReduced.quantity === 0 || productReduced.quantity < 0){
      this.deleteProductFromCart(product);
    }
  }
  /**
   * Increase the quantity of a product in the shopping cart
   */
  increaseQuantity(product: Product){
    const productIncreased : ProductWithQuantity = this.shoppingCart.filter(p => p.product === product)[0];
    productIncreased.quantity++;
  }

}
