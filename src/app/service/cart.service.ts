import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  shoppingCart: Product[] = [];
  cartSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.shoppingCart);
  
  constructor() { }

  /**
   * Add a product to the shopping cart
   */
  addProductToCart(product: Product) {
    const existingProduct = this.shoppingCart.filter(p => p.nombre===product.nombre)[0];
    if (existingProduct!==undefined) {
      existingProduct.cantidad += product.cantidad; // Aumenta la cantidad si el producto ya existe
    } else {
      this.shoppingCart.push(product);
    }
    this.cartSubject.next(this.shoppingCart); // Notifica a los suscriptores
  }

  /**
   * @returns the shopping cart
   */
  getShoppingCart() {
    return this.cartSubject.asObservable();
  }

  /**
   * Remove a product from the shopping cart
   */
  deleteProductFromCart(product: Product) {
    this.shoppingCart = this.shoppingCart.filter(p => p.nombre !== product.nombre);
    this.cartSubject.next(this.shoppingCart); // Notifica a los suscriptores
  }

  /**
   * Reduce the quantity of a product in the shopping cart
   */
  reduceQuantity(product: Product) {
    const existingProduct = this.shoppingCart.find(p => p.nombre === product.nombre);
    if (existingProduct) {
      existingProduct.cantidad--;
      if (existingProduct.cantidad <= 0) {
        this.deleteProductFromCart(product);
      } else {
        this.cartSubject.next(this.shoppingCart); // Notifica a los suscriptores
      }
    }
  }

  /**
   * Increase the quantity of a product in the shopping cart
   */
  increaseQuantity(product: Product) {
    const existingProduct = this.shoppingCart.find(p => p.nombre === product.nombre);
    if (existingProduct) {
      existingProduct.cantidad++;
      this.cartSubject.next(this.shoppingCart); // Notifica a los suscriptores
    }
  }

  /**
   * Clear the shopping cart
   */
  clearCart() {
    this.shoppingCart = [];
    this.cartSubject.next(this.shoppingCart); // Notifica a los suscriptores
  }

  /**
   * @returns the total price of the shopping cart
   */
  getTotal() {
    return this.shoppingCart.reduce((sum, product) => sum + product.precio * product.cantidad, 0);
  }
}
