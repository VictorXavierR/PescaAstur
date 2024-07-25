import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { ProductWithQuantity } from '../model/product-with-quantity';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {

  products: ProductWithQuantity[] = [];
  subtotal: number = 0;
  total: number = 0;

  constructor(private CartService: CartService) { }

  ngOnInit(): void {
    this.products = this.CartService.getShoppingCart();
    this.subtotal = this.calcularSubtotal();
    
  }

  calcularPrecio(precio: number, cantidad: number): number {
    return precio * cantidad;
  }

  calcularSubtotal(): number {
    return this.products.reduce((sum, product) => sum + this.calcularPrecio(product.product.precio, product.quantity), 0);
  }



}
