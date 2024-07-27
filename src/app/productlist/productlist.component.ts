import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product';
import { FirestorageService } from '../service/firestorage.service';
import { Router } from '@angular/router';
import { CartService } from '../service/cart.service';


@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filters = {
    price: null,
    stock: null,
    botasVadeo: false,
    anzuelos: false,
    cajas: false,
    carretes: false,
    vadeadores: false,
    sacaderas: false,
    hilos: false,
    canias: false,
    flotadores: false,
    botasAltas: false,
    chalecos: false
  };

  constructor(private productService: ProductService, private firestorage: FirestorageService, private router: Router, private cartService: CartService) { }

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
        product.cantidad = 0;
      });
      this.filteredProducts = this.products;
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

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      return (
        (this.filters.price === null || product.precio <= this.filters.price) &&
        (this.filters.stock === null || product.cantidadStock >= this.filters.stock) &&
        (!this.filters.botasVadeo || product.categoria.includes('botas de vadeo')) &&
        (!this.filters.anzuelos || product.categoria.includes('anzuelos')) &&
        (!this.filters.cajas || product.categoria.includes('cajas')) &&
        (!this.filters.carretes || product.categoria.includes('carretes')) &&
        (!this.filters.vadeadores || product.categoria.includes('vadeadores')) &&
        (!this.filters.sacaderas || product.categoria.includes('sacaderas')) &&
        (!this.filters.hilos || product.categoria.includes('hilos de pesca')) &&
        (!this.filters.canias || product.categoria.includes('cañas de pescar')) &&
        (!this.filters.flotadores || product.categoria.includes('flotadores')) &&
        (!this.filters.botasAltas || product.categoria.includes('botas altas')) &&
        (!this.filters.chalecos || product.categoria.includes('chalecos'))
      );
    });
  }

  setProduct(product: Product): void {
    this.productService.setProduct(product);
    this.router.navigate(['/product-details']);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    if(product.cantidad > 0){
      this.cartService.addProductToCart(product);
    } 
  }

  incrementQuantity(event: Event, product: Product) {
    event.stopPropagation();
    if(product.cantidadStock > product.cantidad){
        product.cantidad++;
    }
    
  }
  decrementQuantity(event: Event, product: Product) {
    event.stopPropagation();
    if (product.cantidad > 1){
      product.cantidad--;
    } 
    
  }
}
