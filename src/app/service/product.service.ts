import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product!: Product;
  constructor(private http: HttpClient) { }

  getAllProducts(){
    return this.http.get<Product[]>('http://localhost:8080/api/products/all');
  }

  setProduct(product: Product){
    this.product = product;
  }

  getProduct(){
    return this.product;
  }
}
