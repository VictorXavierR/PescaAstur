import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../service/product.service';
import { of } from 'rxjs';
import { Product } from '../model/product';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    // Crear un mock del servicio ProductService
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct', 'addCommentToProduct', 'addRatingToProduct']);

    // Configurar el TestBed
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [
        FormsModule // Asegura que FormsModule está incluido
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    productServiceMock = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    // Datos de prueba para el producto
    const mockProduct: Product = {
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0,
    };

    // Hacer que el mock del servicio devuelva un producto de prueba
    productServiceMock.getProduct.and.returnValue(mockProduct);
    // Mock para `addCommentToProduct` y `addRatingToProduct`
    productServiceMock.addCommentToProduct.and.returnValue(of({}));
    productServiceMock.addRatingToProduct.and.returnValue(of({}));

    fixture.detectChanges();
  });

  afterEach(() => {
    // Restablecer los espías después de cada prueba para evitar conflictos
    productServiceMock.addCommentToProduct.calls.reset();
    productServiceMock.addRatingToProduct.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
 * Test que verifica la correcta carga de un producto al inicializar el componente.
 * Este test asegura que el componente carga los datos de un producto desde el servicio `productService` 
 * cuando se llama al método `ngOnInit`, y que el producto cargado se asigna correctamente a la propiedad 
 * `product` del componente.
 * @test
 * @name should load product on ngOnInit
 * @description Este test asegura que, al inicializar el componente mediante `ngOnInit`, 
 *              se asignan correctamente los datos de un producto a la propiedad `product` del componente.
 *              Además, verifica que el método `getProduct` del servicio `productService` es llamado 
 *              para obtener el producto.
 * @given El componente se inicializa, y el servicio `productService` tiene un método `getProduct` simulado.
 * @when Se ejecuta el método `ngOnInit` del componente.
 * @then La propiedad `product` del componente debe ser igual a los datos esperados del producto, 
 *       y el método `getProduct` del servicio `productService` debe ser llamado.
 * @example
 * expect(component.product).toEqual({
 *   cantidadStock: 5,
 *   categoria: 'prueba',
 *   coste: 10,
 *   descripcion: 'A great product',
 *   descuento: 0,
 *   dimensiones: '',
 *   fechaCreacion: '',
 *   imagenURL: '',
 *   marca: '',
 *   modelo: '',
 *   nombre: '',
 *   peso: '',
 *   precio: 20,
 *   rating: [],
 *   comentarios: [],
 *   UID: '1',
 *   cantidad: 0
 * });
 * expect(productServiceMock.getProduct).toHaveBeenCalled();
 */
  it('should load product on ngOnInit', () => {
    expect(component.product).toEqual({
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0
    });
    expect(productServiceMock.getProduct).toHaveBeenCalled();
  });

  /**
 * Test que verifica que el precio se formatea correctamente al invocar el método `formatPrice`. 
 * Este test asegura que cuando el método `formatPrice` recibe un valor numérico, lo formatea 
 * adecuadamente en formato de precio con dos decimales y el símbolo del euro.
 * @test
 * @name should format price correctly
 * @description Este test verifica que el método `formatPrice` convierte un valor numérico en una cadena 
 *              formateada de manera adecuada, con dos decimales y el símbolo de euro (`€`).
 * @given Se proporciona un número, en este caso `100`.
 * @when Se invoca el método `formatPrice` con el número proporcionado.
 * @then El resultado debe ser una cadena formateada que muestre el número con dos decimales y el símbolo `€`, 
 *       tal como `100,00 €` o `100,00€`.
 * @example 
 * const formattedPrice = component.formatPrice(100);
 * expect(formattedPrice).toMatch(/100,00\s?€/); // Verifica que el precio está formateado correctamente
 */
  it('should format price correctly', () => {
    const formattedPrice = component.formatPrice(100);
    expect(formattedPrice).toMatch(/100,00\s?€/);
  });

  /**
 * Test que verifica que el método `getAverageRating` calcula correctamente la calificación promedio
 * a partir de un arreglo de calificaciones.
 * Este test asegura que cuando se pasa un conjunto de calificaciones, el método devuelve el valor 
 * correcto de la calificación promedio.
 * @test
 * @name should calculate average rating correctly
 * @description Este test verifica que el método `getAverageRating` calcule la calificación promedio
 *              correctamente. Se pasa un conjunto de calificaciones al método y se espera que el valor 
 *              devuelto sea el promedio correcto de esas calificaciones.
 * @given El componente tiene el método `getAverageRating` implementado y un arreglo de calificaciones.
 * @when Se pasa un arreglo de calificaciones con los valores [5, 3, 4] al método `getAverageRating`.
 * @then El método debe devolver el valor 4 como calificación promedio.
 * @example 
 * const ratings = [5, 3, 4];
 * const average = component.getAverageRating(ratings); 
 * expect(average).toBe(4); // Verifica que el promedio de las calificaciones sea 4
 */
  it('should calculate average rating correctly', () => {
    const ratings = [5, 3, 4];
    const average = component.getAverageRating(ratings);
    expect(average).toBe(4);
  });

  /**
 * Test que verifica que el método `addToCart` es llamado correctamente cuando un producto
 * es agregado al carrito.
 * Este test asegura que el componente llama al método `addToCart` con el producto correcto 
 * y que realiza la acción esperada (en este caso, registrar el producto en la consola).
 * @test
 * @name should call addToCart when a product is added to cart
 * @description Este test verifica que, cuando un producto es agregado al carrito, 
 *              el componente invoque el método `addToCart` y registre el producto 
 *              en la consola mediante `console.log`.
 * @given El componente tiene un producto válido con detalles como cantidad de stock,
 *        precio, descripción, etc.
 * @when Se llama al método `addToCart` con un objeto de producto como parámetro.
 * @then El método `console.log` debe ser llamado con el producto como argumento,
 *       asegurando que el producto fue agregado correctamente al carrito.
 * @example 
 * const mockProduct = {
 *   cantidadStock: 5,
 *   categoria: 'prueba',
 *   coste: 10,
 *   descripcion: 'A great product',
 *   descuento: 0,
 *   dimensiones: '',
 *   fechaCreacion: '',
 *   imagenURL: '',
 *   marca: '',
 *   modelo: '',
 *   nombre: '',
 *   peso: '',
 *   precio: 20,
 *   rating: [],
 *   comentarios: [],
 *   UID: '1',
 *   cantidad: 0
 * };
 * component.addToCart(mockProduct); // Verifica que el producto sea registrado en la consola
 * expect(console.log).toHaveBeenCalledWith(mockProduct);
 */
  it('should call addToCart when a product is added to cart', () => {
    spyOn(console, 'log'); // Espiar console.log
    const mockProduct: Product = {
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0
    };

    component.addToCart(mockProduct);

    expect(console.log).toHaveBeenCalledWith(mockProduct);
  });

  /**
 * Test que verifica que no se añadan comentarios ni calificaciones a un producto
 * cuando el comentario está vacío o la calificación es 0.
 * 
 * Este test asegura que el método `addComment` del componente no modifica el producto
 * ni llama a los métodos de servicio para agregar un comentario o una calificación
 * si el comentario proporcionado está vacío o la calificación es 0.
 *
 * @test
 * @name should not add comment or rating if newComment is empty or rating is 0
 * @description Este test valida que el componente no permita agregar un comentario ni una calificación
 *              a un producto si el comentario está vacío o la calificación es 0. Además, asegura que 
 *              los métodos de servicio correspondientes no sean llamados en estas condiciones.
 * @given El componente tiene un comentario vacío (`newComment = ''`) y una calificación de 0 (`rating = 0`).
 * @when Se llama al método `addComment` del componente con un producto.
 * @then El comentario y la calificación no deben añadirse al producto, y los métodos de servicio 
 *       `addCommentToProduct` y `addRatingToProduct` no deben ser llamados.
 * @example 
 * component.newComment = '';  // Comentario vacío
 * component.rating = 0;       // Calificación de 0
 * component.addComment(mockProduct); // Verifica que ni el comentario ni la calificación sean añadidos
 * expect(mockProduct.comentarios.length).toBe(0); // Asegura que no se haya añadido comentario
 * expect(mockProduct.rating.length).toBe(0); // Asegura que no se haya añadido calificación
 * expect(productServiceMock.addCommentToProduct).not.toHaveBeenCalled(); // Verifica que el método no fue llamado
 * expect(productServiceMock.addRatingToProduct).not.toHaveBeenCalled(); // Verifica que el método no fue llamado
 */
  it('should not add comment or rating if newComment is empty or rating is 0', () => {
    const mockProduct: Product = {
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0
    };
    component.newComment = '';
    component.rating = 0;

    // Llama a addComment en condiciones en las que no debe añadir comentario ni calificación
    component.addComment(mockProduct);

    // Verificamos que no se haya añadido comentario o rating al producto
    expect(mockProduct.comentarios.length).toBe(0);
    expect(mockProduct.rating.length).toBe(0);

    // Verificamos que no se hayan llamado los métodos de servicio
    expect(productServiceMock.addCommentToProduct).not.toHaveBeenCalled();
    expect(productServiceMock.addRatingToProduct).not.toHaveBeenCalled();
  });
});
