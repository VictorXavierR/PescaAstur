import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { FirestorageService } from '../service/firestorage.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent implements OnInit {
  products: Product[] = [];
  constructor(private productService: ProductService, private firestorage: FirestorageService) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      this.products.map(product => {
        this.firestorage.downloadFile(product.imagenURL).subscribe({
          next: url => {
            // La URL se ha cargado correctamente
            product.imagenURL = url;
            console.log('Imagen cargada con éxito:', url);
          },
          error: err => {
            // Manejo del error si no se puede cargar la imagen
            console.error('Error al cargar la imagen:', err);
          }
        });
      });
    });
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
}
