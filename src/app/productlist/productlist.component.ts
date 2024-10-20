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
  precio: number = 0;
  stock: number = 0;
  selectedProductType: string = '';

  productTypes = [
    { label: 'Botas de vadeo', value: 'botas de vadeo' },
    { label: 'Anzuelos', value: 'anzuelos' },
    { label: 'Cajas', value: 'cajas' },
    { label: 'Carretes', value: 'carretes' },
    { label: 'Vadeadores', value: 'vadeadores' },
    { label: 'Sacaderas', value: 'sacaderas' },
    { label: 'Hilos de pesca', value: 'hilos de pesca' },
    { label: 'Cañas de pescar', value: 'cañas de pescar' },
    { label: 'Flotadores', value: 'flotadores' },
    { label: 'Botas altas', value: 'botas altas' },
    { label: 'Chalecos', value: 'chalecos' }
  ];

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
    console.log("Filtro seleccionado:", this.selectedProductType);
    console.log("Categorías de productos:", this.products.map(product => product.categoria));

    this.filteredProducts = this.products.filter(product => {
      // Validar precio solo si es mayor a 0
      const matchesPrice = (this.precio === null || this.precio === 0 || product.precio <= this.precio);
      const matchesStock = (this.stock === null || this.stock === 0 || product.cantidadStock >= this.stock);

      // Verifica si la categoría seleccionada coincide con la categoría del producto
      const matchesProductType = (this.selectedProductType === '' ||
        product.categoria === this.selectedProductType);

      console.log({
        productCategory: product.categoria,
        priceMatch: matchesPrice,
        stockMatch: matchesStock,
        productTypeMatch: matchesProductType
      }); // Para verificar las coincidencias en cada producto

      return matchesPrice && matchesStock && matchesProductType;
    });

    console.log("Productos filtrados:", this.filteredProducts);
  }


  setProduct(product: Product): void {
    this.productService.setProduct(product);
    this.router.navigate(['/product-details']);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    if (product.cantidad > 0) {
      this.cartService.addProductToCart(product);
    }
  }

  incrementQuantity(event: Event, product: Product) {
    event.stopPropagation();
    if (product.cantidadStock > product.cantidad) {
      product.cantidad++;
    }

  }
  decrementQuantity(event: Event, product: Product) {
    event.stopPropagation();
    if (product.cantidad > 1) {
      product.cantidad--;
    }
  } 
  
  ordenarAlfabeticmente() {
    this.filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
}
