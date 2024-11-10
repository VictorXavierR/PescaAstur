import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { CartService } from '../service/cart.service';
import { Product } from '../model/product';
import { of } from 'rxjs';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    // Creamos un mock del CartService
    cartServiceMock = jasmine.createSpyObj('CartService', ['getShoppingCart', 'deleteProductFromCart']);
    
    TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock }  // Usamos el mock del CartService
      ]
    });

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /**
   * Test para verificar la correcta inicialización de los productos y subtotales.
   * @test
   * @name should initialize products and subtotal
   * @description Este test asegura que cuando se inicializa el componente, los productos se recuperan correctamente
   *              desde el servicio CartService y que el subtotal se calcula correctamente.
   * @given Un servicio CartService mockeado que retorna un conjunto de productos.
   * @when Se llama al método ngOnInit.
   * @then Los productos y el subtotal deben ser correctamente establecidos.
   */
  it('should initialize products and subtotal', () => {
    const mockProducts: Product[] = [
      { nombre: 'Product 1', precio: 100, cantidad: 2, cantidadStock: 10, categoria: '', coste: 50, descripcion: '', descuento: 10, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '1' },
      { nombre: 'Product 2', precio: 50, cantidad: 1, cantidadStock: 5, categoria: '', coste: 30, descripcion: '', descuento: 5, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '2' }
    ];
    // Hacemos que el método getShoppingCart retorne productos simulados
    cartServiceMock.getShoppingCart.and.returnValue(of(mockProducts));
    // Llamamos al ngOnInit para que se ejecute la lógica de inicialización
    component.ngOnInit();
    fixture.detectChanges();  // Detectamos cambios para que Angular ejecute la actualización de la vista
    // Verificamos que los productos fueron correctamente asignados
    expect(component.products).toEqual(mockProducts);
    // Verificamos que el subtotal sea el correcto
    const expectedSubtotal = mockProducts.reduce(
      (sum, product) => sum + product.precio * product.cantidad,
      0
    );
    expect(component.subtotal).toBe(expectedSubtotal);
  });

  /**
   * Test para verificar el cálculo del subtotal.
   * @test
   * @name should calculate subtotal correctly
   * @description Este test asegura que el método calcularSubtotal calcule el subtotal correctamente
   *              basado en los productos del carrito.
   * @given Un conjunto de productos con precios y cantidades.
   * @when Se llama al método calcularSubtotal.
   * @then El subtotal debe ser el resultado correcto de sumar el precio por la cantidad de cada producto.
   */
  it('should calculate subtotal correctly', () => {
    const mockProducts: Product[] = [
      { nombre: 'Product 1', precio: 100, cantidad: 2, cantidadStock: 10, categoria: '', coste: 50, descripcion: '', descuento: 10, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '1' },
      { nombre: 'Product 2', precio: 50, cantidad: 1, cantidadStock: 5, categoria: '', coste: 30, descripcion: '', descuento: 5, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '2' }
    ];
    component.products = mockProducts;
    const subtotal = component.calcularSubtotal();
    // Verificamos que el subtotal es el correcto
    const expectedSubtotal = mockProducts.reduce(
      (sum, product) => sum + product.precio * product.cantidad,
      0
    );
    expect(subtotal).toBe(expectedSubtotal);
  });

  /**
   * Test para verificar la correcta ordenación de los productos por precio.
   * @test
   * @name should order products by price
   * @description Este test asegura que el método ordenarPrecio ordene correctamente los productos
   *              en orden ascendente por su precio.
   * @given Un conjunto de productos con diferentes precios.
   * @when Se llama al método ordenarPrecio.
   * @then Los productos deben estar ordenados en orden ascendente por precio.
   */
  it('should order products by price', () => {
    const mockProducts: Product[] = [
      { nombre: 'Product 1', precio: 200, cantidad: 1, cantidadStock: 10, categoria: '', coste: 50, descripcion: '', descuento: 10, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '1' },
      { nombre: 'Product 2', precio: 100, cantidad: 2, cantidadStock: 5, categoria: '', coste: 30, descripcion: '', descuento: 5, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '2' },
      { nombre: 'Product 3', precio: 150, cantidad: 3, cantidadStock: 15, categoria: '', coste: 75, descripcion: '', descuento: 10, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '3' }
    ];
    component.products = mockProducts;
    component.ordenarPrecio();  // Llamamos al método para ordenar los productos

    // Verificamos que los productos estén ordenados correctamente
    const sortedProducts = [...mockProducts].sort((a, b) => a.precio - b.precio);
    expect(component.products).toEqual(sortedProducts);
  });

  /**
   * Test para verificar que un producto sea borrado del carrito.
   * @test
   * @name should delete product from cart
   * @description Este test asegura que el método borrarProducto llama correctamente al servicio
   *              CartService.deleteProductFromCart para borrar un producto.
   * @given Un producto que ya está en el carrito.
   * @when Se llama al método borrarProducto con ese producto.
   * @then El servicio deleteProductFromCart debe ser llamado con el producto correcto.
   */
  it('should delete product from cart', () => {
    const mockProduct: Product = { nombre: 'Product 1', precio: 100, cantidad: 2, cantidadStock: 10, categoria: '', coste: 50, descripcion: '', descuento: 10, dimensiones: '', fechaCreacion: '', imagenURL: '', marca: '', modelo: '', peso: '', rating: [], comentarios: [], UID: '123' };
    // Llamamos al método borrarProducto
    component.borrarProducto(mockProduct);
    // Verificamos que el servicio deleteProductFromCart haya sido llamado con el producto correcto
    expect(cartServiceMock.deleteProductFromCart).toHaveBeenCalledWith(mockProduct);
  });
});

  