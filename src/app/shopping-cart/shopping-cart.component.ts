import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {

  products: Product[] = [];
  subtotal: number = 0;
  total: number = 0;

  constructor(private CartService: CartService) { }

  ngOnInit(): void {
    this.CartService.getShoppingCart().subscribe((products: Product[]) => {
      this.products = products;
      this.subtotal = this.calcularSubtotal();
    });
  }

  calcularPrecio(precio: number, cantidad: number): number {
    return precio * cantidad;
  }

  calcularSubtotal(): number {
    return this.products.reduce((sum, product) => sum + this.calcularPrecio(product.precio, product.cantidad), 0);
  }
  
  ordenarPrecio(){
    this.products = this.products.sort((a, b) => a.precio - b.precio);
  }

  borrarProducto(product: Product) {
    this.CartService.deleteProductFromCart(product);
  }

}
