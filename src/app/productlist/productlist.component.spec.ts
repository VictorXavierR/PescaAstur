import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductlistComponent } from './productlist.component';
import { ProductService } from '../service/product.service';
import { FirestorageService } from '../service/firestorage.service';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('ProductlistComponent', () => {
  let component: ProductlistComponent;
  let fixture: ComponentFixture<ProductlistComponent>;
  let productService: ProductService;
  let firestorageService: FirestorageService;
  let cartService: CartService;
  let router: Router;

  beforeEach(async () => {
    const productServiceMock = {
      getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of([
        { nombre: 'Producto 1', precio: 10, cantidadStock: 5, imagenURL: '', categoria: 'botas de vadeo', cantidad: 0 },
        { nombre: 'Producto 2', precio: 20, cantidadStock: 3, imagenURL: '', categoria: 'anzuelos', cantidad: 0 }
      ])),
      setProduct: jasmine.createSpy('setProduct')
    };

    const firestorageServiceMock = {
      downloadFile: jasmine.createSpy('downloadFile').and.returnValue(of('url'))
    };

    const cartServiceMock = {
      addProductToCart: jasmine.createSpy('addProductToCart')
    };

    await TestBed.configureTestingModule({
      declarations: [ProductlistComponent],
      imports: [RouterTestingModule,FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: FirestorageService, useValue: firestorageServiceMock },
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductlistComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    firestorageService = TestBed.inject(FirestorageService);
    cartService = TestBed.inject(CartService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize products on ngOnInit', () => {
    component.ngOnInit();
    expect(productService.getAllProducts).toHaveBeenCalled();
    expect(component.products.length).toBeGreaterThan(0);
    expect(component.filteredProducts.length).toBeGreaterThan(0);
  });
  /**
 * Test que verifica el correcto funcionamiento de los filtros aplicados
 * en el método `applyFilters` del componente `ProductlistComponent`.
 * @test
 * @name should apply filters correctly
 * @description Este test asegura que el método `applyFilters` filtre correctamente
 *              los productos según el precio máximo, el stock mínimo y el tipo 
 *              de producto seleccionado. El filtro debe aplicarse correctamente 
 *              a una lista de productos con los siguientes criterios:
 *              - El precio debe ser menor o igual al valor especificado (`precio`).
 *              - El stock debe ser mayor o igual al valor especificado (`stock`).
 *              - El tipo de producto debe coincidir con el tipo seleccionado (`selectedProductType`).
 * @given Una lista de productos con diferentes categorías, precios y stocks.
 *        - Un producto de tipo "Cañas de pescar" con precio 79.99 y stock 25.
 *        - Un producto de tipo "Carretes" con precio 55.0 y stock 15.
 * @given Filtros aplicados con los siguientes valores:
 *        - `precio = 80` (Filtra productos con precio ≤ 80).
 *        - `stock = 10` (Filtra productos con stock ≥ 10).
 *        - `selectedProductType = 'Cañas de pescar'` (Filtra productos de esta categoría).
 * @when Se ejecuta el método `applyFilters`.
 * 
 * @then La lista de productos filtrados debe contener solo un producto: 
 *        "Caña de pescar RiverMaster", ya que es el único producto que cumple
 *        con los tres criterios de filtrado (precio ≤ 80, stock ≥ 10 y tipo "Cañas de pescar").
 * @example 
 * component.products = [
 *   { cantidadStock: 25, categoria: 'Cañas de pescar', precio: 79.99, nombre: 'Caña de pescar RiverMaster', ... },
 *   { cantidadStock: 15, categoria: 'Carretes', precio: 55.0, nombre: 'Carrete OceanWave', ... }
 * ];
 * component.precio = 80;
 * component.stock = 10;
 * component.selectedProductType = 'Cañas de pescar';
 * component.applyFilters();
 * expect(component.filteredProducts.length).toBe(1);
 * expect(component.filteredProducts[0].nombre).toBe('Caña de pescar RiverMaster');
 */
  it('should apply filters correctly', () => {
    component.products = [
      {
        cantidadStock: 25,
        categoria: 'Cañas de pescar',
        coste: 45.99,
        descripcion: 'Caña de pescar ligera y duradera, ideal para pesca en río y lago.',
        descuento: 10,
        dimensiones: '150 cm x 10 cm x 10 cm',
        fechaCreacion: '2023-05-15',
        imagenURL: 'https://example.com/images/cana-de-pescar.jpg',
        marca: 'PescaPro',
        modelo: 'RiverMaster 3000',
        nombre: 'Caña de pescar RiverMaster',
        peso: '1.5 kg',
        precio: 79.99,
        rating: [5, 4, 5, 3, 4],
        comentarios: [
            'Excelente calidad y muy ligera.',
            'Ideal para principiantes y fácil de manejar.',
            'Buena relación calidad-precio.' 
        ],
        UID: 'abc123def456',
        cantidad: 1,
      },
      {
        cantidadStock: 15,
        categoria: 'Carretes',
        coste: 30.5,
        descripcion: 'Carrete de pesca resistente, perfecto para pesca en agua salada y dulce.',
        descuento: 5,
        dimensiones: '12 cm x 8 cm x 8 cm',
        fechaCreacion: '2023-07-10',
        imagenURL: 'https://example.com/images/carrete.jpg',
        marca: 'AquaTech',
        modelo: 'OceanWave 500',
        nombre: 'Carrete OceanWave',
        peso: '0.8 kg',
        precio: 55.0,
        rating: [4, 5, 4, 4, 3],
        comentarios: [
          'Muy buen carrete, aguanta bien.',
          'Compacto y ligero, fácil de usar.',
          'Excelente para pesca en mar.'
        ],
        UID: 'xyz789ghi123',
        cantidad: 1,
      } 
    ];
  
    // Configuración de filtros
    component.precio = 80;
    component.stock = 10;
    component.selectedProductType = 'Cañas de pescar';
  
    component.applyFilters();
  
    console.log('Productos después de aplicar filtros:', component.filteredProducts);
  
    // Verificación de los resultados esperados
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].nombre).toBe('Caña de pescar RiverMaster');
  });
  
/**
 * Test que verifica el correcto formateo del precio en euros
 * utilizando el método `formatPrice` del componente `ProductlistComponent`.
 * @test
 * @name should format price correctly
 * @description Este test asegura que el método `formatPrice` formatee
 *              correctamente el precio en euros en el formato `es-ES`,
 *              devolviendo una cadena que siga el formato de "100,00 €" 
 *              o "100,00€", con o sin espacio antes del símbolo `€`.
 * @given Un valor numérico de entrada de `100`.
 * 
 * @when Se llama al método `formatPrice` con el valor `100`.
 * 
 * @then El método debería devolver el valor formateado como `100,00 €`
 *       o `100,00€`.
 *
 * @regex /^100,00\s?€$/ La expresión regular utilizada para validar el
 *        formato de la cadena, permitiendo un espacio opcional entre
 *        el valor numérico y el símbolo `€`.
 * @example 
 * const formattedPrice = component.formatPrice(100);
 * expect(formattedPrice).toMatch(/^100,00\s?€$/);
 */
  it('should format price correctly', () => {
    const formattedPrice = component.formatPrice(100);
    // Verifica que el formato sea "100,00" seguido opcionalmente de un espacio y luego el símbolo "€"
    const regex = /^100,00\s?€$/;
    expect(formattedPrice).toMatch(regex);
  });
 /**
 * Test que verifica que un producto se añade correctamente al carrito
 * cuando su cantidad es mayor a 0 utilizando el método `addToCart`
 * del componente `ProductlistComponent`.
 * @test
 * @name should add product to cart if quantity is greater than 0
 * @description Este test asegura que cuando el producto tiene una cantidad mayor a 0,
 *              el método `addToCart` llama correctamente al servicio `cartService` para
 *              añadir el producto al carrito. Si la cantidad es mayor que 0, se debe
 *              invocar el método `addProductToCart` del `CartService` con el producto.
 * @given Un producto con una cantidad mayor a 0 (`cantidad = 1`).
 * @given El evento es un `MouseEvent` (simulando un clic).
 * @when Se llama al método `addToCart` del componente pasando el producto y el evento.
 * @then El servicio `cartService.addProductToCart` debe ser llamado con el producto como argumento.
 * @example 
 * const product = { cantidadStock: 15, categoria: 'Carretes', precio: 55.0, nombre: 'Carrete OceanWave', ... };
 * const event = new MouseEvent('click');
 * component.addToCart(product, event);
 * expect(cartService.addProductToCart).toHaveBeenCalledWith(product);
 */
  it('should add product to cart if quantity is greater than 0', () => {
    const product = { cantidadStock: 15,
      categoria: 'Carretes',
      coste: 30.5,
      descripcion: 'Carrete de pesca resistente, perfecto para pesca en agua salada y dulce.',
      descuento: 5, // porcentaje de descuento
      dimensiones: '12 cm x 8 cm x 8 cm',
      fechaCreacion: '2023-07-10',
      imagenURL: 'https://example.com/images/carrete.jpg',
      marca: 'AquaTech',
      modelo: 'OceanWave 500',
      nombre: 'Carrete OceanWave',
      peso: '0.8 kg',
      precio: 55.0,
      rating: [4, 5, 4, 4, 3], // calificaciones de ejemplo
      comentarios: [
        'Muy buen carrete, aguanta bien.',
        'Compacto y ligero, fácil de usar.',
        'Excelente para pesca en mar.'
      ],
      UID: 'xyz789ghi123',
      cantidad: 1, };
    const event = new MouseEvent('click');
    component.addToCart(product, event);
    expect(cartService.addProductToCart).toHaveBeenCalledWith(product);
  });
  /**
 * Test que verifica que la cantidad de un producto no se incremente más allá
 * de la cantidad de stock disponible utilizando el método `incrementQuantity`
 * del componente `ProductlistComponent`.
 * @test
 * @name should not increment quantity beyond stock
 * @description Este test asegura que el método `incrementQuantity` no permitirá
 *              que la cantidad de un producto exceda la cantidad de stock disponible.
 *              En el caso de que la cantidad del producto sea mayor que la cantidad
 *              de stock (`cantidadStock = 0`), el valor de `cantidad` no debe incrementarse.
 * @given Un producto con `cantidadStock = 0` y `cantidad = 1`.
 * @given El evento es un `MouseEvent` (simulando un clic).
 * @when Se llama al método `incrementQuantity` del componente pasando el producto y el evento.
 * @then La cantidad del producto debe permanecer igual (`cantidad = 1`), ya que no se puede incrementar más allá del stock disponible.
 * @example 
 * const product = { cantidadStock: 0, categoria: 'Carretes', precio: 55.0, nombre: 'Carrete OceanWave', ... };
 * const event = new MouseEvent('click');
 * component.incrementQuantity(event, product);
 * expect(product.cantidad).toBe(1);
 */
  it('should not increment quantity beyond stock', () => {
    const product = { cantidadStock: 0,
      categoria: 'Carretes',
      coste: 30.5,
      descripcion: 'Carrete de pesca resistente, perfecto para pesca en agua salada y dulce.',
      descuento: 5, // porcentaje de descuento
      dimensiones: '12 cm x 8 cm x 8 cm',
      fechaCreacion: '2023-07-10',
      imagenURL: 'https://example.com/images/carrete.jpg',
      marca: 'AquaTech',
      modelo: 'OceanWave 500',
      nombre: 'Carrete OceanWave',
      peso: '0.8 kg',
      precio: 55.0,
      rating: [4, 5, 4, 4, 3], // calificaciones de ejemplo
      comentarios: [
        'Muy buen carrete, aguanta bien.',
        'Compacto y ligero, fácil de usar.',
        'Excelente para pesca en mar.'
      ],
      UID: 'xyz789ghi123',
      cantidad: 1,};
    const event = new MouseEvent('click');
    component.incrementQuantity(event, product);
    expect(product.cantidad).toBe(1);
  });
  /**
 * Test que verifica que la cantidad de un producto se decrementa correctamente
 * utilizando el método `decrementQuantity` del componente `ProductlistComponent`.
 * @test
 * @name should decrement product quantity
 * @description Este test asegura que el método `decrementQuantity` reduce correctamente
 *              la cantidad de un producto en 1 cuando se llama. En este caso, el valor de
 *              la cantidad pasa de `2` a `1` cuando el stock del producto es suficiente.
 * @given Un producto con `cantidad = 2` y `cantidadStock = 15`.
 * @given El evento es un `MouseEvent` (simulando un clic).
 * @when Se llama al método `decrementQuantity` del componente pasando el producto y el evento.
 * @then La cantidad del producto debe reducirse en 1, por lo que `cantidad` pasa de `2` a `1`.
 * @example 
 * const product = { cantidadStock: 15, categoria: 'Carretes', precio: 55.0, nombre: 'Carrete OceanWave', cantidad: 2, ... };
 * const event = new MouseEvent('click');
 * component.decrementQuantity(event, product);
 * expect(product.cantidad).toBe(1);
 */
  it('should decrement product quantity', () => {
    const product = { cantidadStock: 15,
      categoria: 'Carretes',
      coste: 30.5,
      descripcion: 'Carrete de pesca resistente, perfecto para pesca en agua salada y dulce.',
      descuento: 5, // porcentaje de descuento
      dimensiones: '12 cm x 8 cm x 8 cm',
      fechaCreacion: '2023-07-10',
      imagenURL: 'https://example.com/images/carrete.jpg',
      marca: 'AquaTech',
      modelo: 'OceanWave 500',
      nombre: 'Carrete OceanWave',
      peso: '0.8 kg',
      precio: 55.0,
      rating: [4, 5, 4, 4, 3], // calificaciones de ejemplo
      comentarios: [
        'Muy buen carrete, aguanta bien.',
        'Compacto y ligero, fácil de usar.',
        'Excelente para pesca en mar.'
      ],
      UID: 'xyz789ghi123',
      cantidad: 2,};
    const event = new MouseEvent('click');
    component.decrementQuantity(event, product);
    expect(product.cantidad).toBe(1);
  });
  /**
 * Test que verifica que la cantidad de un producto no se puede decrementar
 * por debajo de 1 utilizando el método `decrementQuantity` del componente `ProductlistComponent`.
 * @test
 * @name should not decrement quantity below 1
 * @description Este test asegura que el método `decrementQuantity` no permita que
 *              la cantidad de un producto se decremente por debajo de 1. Si la cantidad
 *              actual es 1, el valor de `cantidad` no debe disminuir.
 * @given Un producto con `cantidad = 1` y `cantidadStock = 15`.
 * @given El evento es un `MouseEvent` (simulando un clic).
 * @when Se llama al método `decrementQuantity` del componente pasando el producto y el evento.
 * @then La cantidad del producto no debe decrecer por debajo de 1, por lo que `cantidad` sigue siendo `1`.
 * @example 
 * const product = { cantidadStock: 15, categoria: 'Carretes', precio: 55.0, nombre: 'Carrete OceanWave', cantidad: 1, ... };
 * const event = new MouseEvent('click');
 * component.decrementQuantity(event, product);
 * expect(product.cantidad).toBe(1);
 */
  it('should not decrement quantity below 1', () => {
    const product = { cantidadStock: 15,
      categoria: 'Carretes',
      coste: 30.5,
      descripcion: 'Carrete de pesca resistente, perfecto para pesca en agua salada y dulce.',
      descuento: 5, // porcentaje de descuento
      dimensiones: '12 cm x 8 cm x 8 cm',
      fechaCreacion: '2023-07-10',
      imagenURL: 'https://example.com/images/carrete.jpg',
      marca: 'AquaTech',
      modelo: 'OceanWave 500',
      nombre: 'Carrete OceanWave',
      peso: '0.8 kg',
      precio: 55.0,
      rating: [4, 5, 4, 4, 3], // calificaciones de ejemplo
      comentarios: [
        'Muy buen carrete, aguanta bien.',
        'Compacto y ligero, fácil de usar.',
        'Excelente para pesca en mar.'
      ],
      UID: 'xyz789ghi123',
      cantidad: 1, };
    const event = new MouseEvent('click');
    component.decrementQuantity(event, product);
    expect(product.cantidad).toBe(1);
  });
  /**
 * Test que verifica que los productos se ordenan alfabéticamente
 * utilizando el método `ordenarAlfabeticmente` del componente `ProductlistComponent`.
 * @test
 * @name should sort products alphabetically
 * @description Este test asegura que el método `ordenarAlfabeticmente` ordene correctamente
 *              los productos en la lista `filteredProducts` por su nombre de forma alfabética.
 *              Después de aplicar el orden, el primer producto de la lista debe tener el nombre
 *              que esté al principio del orden alfabético.
 * @given Una lista de productos con los nombres 'Carrete OceanWave' y 'RiverMaster'.
 * @when Se llama al método `ordenarAlfabeticmente` para ordenar los productos alfabéticamente.
 * @then El primer producto de la lista debe ser 'Carrete OceanWave', que es el que
 *       está alfabéticamente antes de 'RiverMaster'.
 * @example 
 * component.filteredProducts = [
 *   { nombre: 'Carrete OceanWave', precio: 55.0, ... },
 *   { nombre: 'RiverMaster', precio: 79.99, ... }
 * ];
 * component.ordenarAlfabeticmente();
 * expect(component.filteredProducts[0].nombre).toBe('Carrete OceanWave');
 */
  it('should sort products alphabetically', () => {
    component.filteredProducts = [
      { cantidadStock: 15,
        categoria: 'Carretes',
        coste: 30.5,
        descripcion: 'Carrete de pesca resistente, perfecto para pesca en agua salada y dulce.',
        descuento: 5, // porcentaje de descuento
        dimensiones: '12 cm x 8 cm x 8 cm',
        fechaCreacion: '2023-07-10',
        imagenURL: 'https://example.com/images/carrete.jpg',
        marca: 'AquaTech',
        modelo: 'OceanWave 500',
        nombre: 'Carrete OceanWave',
        peso: '0.8 kg',
        precio: 55.0,
        rating: [4, 5, 4, 4, 3], // calificaciones de ejemplo
        comentarios: [
          'Muy buen carrete, aguanta bien.',
          'Compacto y ligero, fácil de usar.',
          'Excelente para pesca en mar.'
        ],
        UID: 'xyz789ghi123',
        cantidad: 1, },
      { cantidadStock : 25,
        categoria : 'Cañas de pescar',
        coste : 45.99,
        descripcion : 'Caña de pescar ligera y duradera, ideal para pesca en río y lago.',
        descuento : 10, // porcentaje de descuento
        dimensiones : '150 cm x 10 cm x 10 cm',
        fechaCreacion : '2023-05-15',
        imagenURL : 'https://example.com/images/cana-de-pescar.jpg',
        marca : 'PescaPro',
        modelo : 'RiverMaster 3000',
        nombre : 'RiverMaster',
        peso : '1.5 kg',
        precio : 79.99,
        rating : [5, 4, 5, 3, 4], // calificaciones de ejemplo
        comentarios : [
            'Excelente calidad y muy ligera.',
            'Ideal para principiantes y fácil de manejar.',
            'Buena relación calidad-precio.' 
        ],
        UID : 'abc123def456',
        cantidad : 1,}
    ];
    component.ordenarAlfabeticmente();
    expect(component.filteredProducts[0].nombre).toBe('Carrete OceanWave');
  });
});
