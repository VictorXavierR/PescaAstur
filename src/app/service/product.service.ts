import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product!: Product;
  constructor(private http: HttpClient) { }
  /**
   * Recibe todos los productos del backend
   * @returns la respuesta del controlador 
   */
  getAllProducts(){
    return this.http.get<Product[]>('http://localhost:8080/api/products/all');
  }

  setProduct(product: Product){
    this.product = product;
  }

  getProduct(){
    return this.product;
  }
  /**
   * Add a comment to a product
   * @returns the response from the controller 
   */
  addCommentToProduct(product : Product): Observable<any> {
    const url = 'http://localhost:8080/api/products/addCommentToComments';
    return this.http.patch<any>(url, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  /**
   * Add a rating to a product
   * @returns the response from the controller
  */
  addRatingToProduct(product : Product): Observable<any> {
    const url = 'http://localhost:8080/api/products/addRatingToRatings';
    return this.http.patch<any>(url, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
