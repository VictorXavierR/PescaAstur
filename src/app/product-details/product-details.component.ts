import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  newComment = '';
  rating = 0;

  constructor(private productService : ProductService) { }

  ngOnInit(): void {
    this.product = this.productService.getProduct();
  }

  formatPrice(price: number): string {
    // Formatea el precio como moneda y extrae la cantidad
    const formattedPrice = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);

    // Devuelve el precio con el símbolo al final
    return formattedPrice.replace('€', '') + '€';
  }
  addToCart(product: Product){
    console.log(product);
  }
  getAverageRating(ratings: number[]): number {
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return ratings.length ? Math.round(total / ratings.length) : 0;
  }
  rateProduct(product: any, rating: number) {
    product.rating.push(rating);
  }
  addComment(product: any) {
    product.comentarios.push(this.newComment);
    this.newComment = '';
  }
  setRating(rating: number) {
    this.rating = rating;
  }
}
