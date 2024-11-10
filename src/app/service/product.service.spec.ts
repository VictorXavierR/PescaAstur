import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../model/product';


describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Inyectar el módulo para realizar las pruebas HTTP
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);  // Inyectar el servicio que estamos probando
    httpMock = TestBed.inject(HttpTestingController);  // Inyectar el controlador para manejar las solicitudes HTTP
  });

  afterEach(() => {
    httpMock.verify();  // Verificar que no hay solicitudes HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();  // Asegurarse de que el servicio se cree correctamente
  });

  /**
   * Test que verifica el funcionamiento del método `getAllProducts`.
   * Este test asegura que el método realice correctamente una solicitud GET
   * al backend y devuelva los productos correctamente.
   * @test
   * @name should fetch all products
   * @description Este test verifica que el método `getAllProducts` realiza una solicitud GET correctamente
   *              y devuelve una lista de productos.
   * @given El servicio `ProductService`.
   * @when Se llama al método `getAllProducts`.
   * @then Se realiza una solicitud GET a la URL correcta y se recibe una lista de productos.
   * @example 
   * service.getAllProducts().subscribe((products) => {
   *   expect(products).toEqual(mockProducts);
   * });
   */
  it('should fetch all products', () => {
    const mockProducts: Product[] = [
      new Product(),  // Simular un producto con los valores por defecto del constructor
      new Product()
    ];

    service.getAllProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);  // Verificar que los productos devueltos son los esperados
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/all');  // Verificar que la URL es la correcta
    expect(req.request.method).toBe('GET');  // Asegurarse de que se hace una solicitud GET
    req.flush(mockProducts);  // Responder con los productos simulados
  });

  /**
   * Test que verifica el funcionamiento del método `addCommentToProduct`.
   * Este test asegura que el método realice correctamente una solicitud PATCH
   * para agregar un comentario a un producto.
   * @test
   * @name should add comment to product
   * @description Este test verifica que el método `addCommentToProduct` realiza una solicitud PATCH
   *              correctamente y agrega un comentario al producto.
   * @given El servicio `ProductService` y un producto con un comentario.
   * @when Se llama al método `addCommentToProduct` con el producto.
   * @then Se realiza una solicitud PATCH a la URL correcta y se recibe la respuesta.
   * @example 
   * service.addCommentToProduct(product).subscribe((response) => {
   *   expect(response).toEqual(mockResponse);
   * });
   */
  it('should add comment to product', () => {
    const mockProduct: Product = new Product();
    mockProduct.comentarios = ['Nuevo comentario'];

    const mockResponse = { message: 'Comentario añadido correctamente' };

    service.addCommentToProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);  // Verificar que la respuesta es la esperada
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/addCommentToComments');  // Verificar la URL de la solicitud
    expect(req.request.method).toBe('PATCH');  // Asegurarse de que se hace una solicitud PATCH
    expect(req.request.headers.get('Content-Type')).toBe('application/json');  // Verificar los encabezados
    req.flush(mockResponse);  // Responder con la simulación de la respuesta
  });

  /**
   * Test que verifica el funcionamiento del método `addRatingToProduct`.
   * Este test asegura que el método realice correctamente una solicitud PATCH
   * para agregar una calificación a un producto.
   * @test
   * @name should add rating to product
   * @description Este test verifica que el método `addRatingToProduct` realiza una solicitud PATCH
   *              correctamente y agrega una calificación al producto.
   * @given El servicio `ProductService` y un producto con una calificación.
   * @when Se llama al método `addRatingToProduct` con el producto.
   * @then Se realiza una solicitud PATCH a la URL correcta y se recibe la respuesta.
   * @example 
   * service.addRatingToProduct(product).subscribe((response) => {
   *   expect(response).toEqual(mockResponse);
   * });
   */
  it('should add rating to product', () => {
    const mockProduct: Product = new Product();
    mockProduct.rating = [5];

    const mockResponse = { message: 'Calificación añadida correctamente' };

    service.addRatingToProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockResponse);  // Verificar que la respuesta es la esperada
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/addRatingToRatings');  // Verificar la URL de la solicitud
    expect(req.request.method).toBe('PATCH');  // Asegurarse de que se hace una solicitud PATCH
    expect(req.request.headers.get('Content-Type')).toBe('application/json');  // Verificar los encabezados
    req.flush(mockResponse);  // Responder con la simulación de la respuesta
  });

  /**
   * Test que verifica el funcionamiento del método `updateStocks`.
   * Este test asegura que el método realice correctamente una solicitud POST
   * para actualizar los stocks de los productos.
   * @test
   * @name should update product stocks
   * @description Este test verifica que el método `updateStocks` realiza una solicitud POST correctamente
   *              y devuelve un mensaje de respuesta adecuado.
   * @given El servicio `ProductService` y una lista de productos con cantidades actualizadas.
   * @when Se llama al método `updateStocks` con los productos.
   * @then Se realiza una solicitud POST a la URL correcta y se recibe un mensaje de éxito.
   * @example 
   * service.updateStocks(products).subscribe((response) => {
   *   expect(response).toEqual('Stocks actualizados');
   * });
   */
  it('should update product stocks', () => {
    const mockProducts: Product[] = [
      new Product(),
      new Product()
    ];

    const mockResponse = 'Stocks actualizados';

    service.updateStocks(mockProducts).subscribe((response) => {
      expect(response).toEqual(mockResponse);  // Verificar que la respuesta es la esperada
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/update-stocks');  // Verificar la URL de la solicitud
    expect(req.request.method).toBe('POST');  // Asegurarse de que se hace una solicitud POST
    expect(req.request.headers.get('Content-Type')).toBe('application/json');  // Verificar los encabezados
    req.flush(mockResponse);  // Responder con la simulación de la respuesta
  });
});
