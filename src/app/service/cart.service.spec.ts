import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../model/product';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  /**
   * Test que verifica el funcionamiento del método `addProductToCart` del servicio `CartService`.
   * Este test asegura que un producto sea correctamente agregado al carrito de compras.
   * @test
   * @name should add product to cart
   * @description Este test asegura que el método `addProductToCart` en el servicio `CartService`
   *              agrega correctamente el producto al carrito de compras.
   * @given El servicio `CartService` con un carrito vacío.
   * @when Se llama al método `addProductToCart` con un producto.
   * @then El producto debería ser agregado al carrito de compras.
   * @example 
   * service.addProductToCart(product);
   * expect(service.shoppingCart.length).toBe(1);
   */
  it('should add product to cart', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);

    expect(service.shoppingCart.length).toBe(1);
    expect(service.shoppingCart[0].nombre).toBe('Carrete de Pesca');
  });

  /**
   * Test que verifica el funcionamiento del método `deleteProductFromCart` del servicio `CartService`.
   * Este test asegura que un producto sea correctamente eliminado del carrito de compras.
   * @test
   * @name should delete product from cart
   * @description Este test asegura que el método `deleteProductFromCart` en el servicio `CartService`
   *              elimine correctamente el producto del carrito de compras.
   * @given El servicio `CartService` con un producto en el carrito. 
   * @when Se llama al método `deleteProductFromCart` con el producto.
   * @then El producto debería ser eliminado del carrito de compras.
   * @example 
   * service.deleteProductFromCart(product);
   * expect(service.shoppingCart.length).toBe(0);
   */
  it('should delete product from cart', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);
    service.deleteProductFromCart(product);

    expect(service.shoppingCart.length).toBe(0);
  });

  /**
   * Test que verifica el funcionamiento del método `reduceQuantity` del servicio `CartService`.
   * Este test asegura que la cantidad de un producto en el carrito se reduzca correctamente.
   * @test
   * @name should reduce product quantity
   * @description Este test asegura que el método `reduceQuantity` en el servicio `CartService`
   *              reduzca correctamente la cantidad del producto en el carrito.
   * @given El servicio `CartService` con un producto en el carrito con cantidad mayor que 1.
   * @when Se llama al método `reduceQuantity` con el producto.
   * @then La cantidad del producto debería reducirse en 1.
   * @example 
   * service.reduceQuantity(product);
   * expect(product.cantidad).toBe(1);
   */
  it('should reduce product quantity', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);
    service.reduceQuantity(product);

    expect(product.cantidad).toBe(1);
  });

  /**
   * Test que verifica el funcionamiento del método `increaseQuantity` del servicio `CartService`.
   * Este test asegura que la cantidad de un producto en el carrito se incremente correctamente.
   * @test
   * @name should increase product quantity
   * @description Este test asegura que el método `increaseQuantity` en el servicio `CartService`
   *              incremente correctamente la cantidad del producto en el carrito.
   * @given El servicio `CartService` con un producto en el carrito.
   * @when Se llama al método `increaseQuantity` con el producto.
   * @then La cantidad del producto debería incrementarse en 1.
   * @example 
   * service.increaseQuantity(product);
   * expect(product.cantidad).toBe(3);
   */
  it('should increase product quantity', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);
    service.increaseQuantity(product);

    expect(product.cantidad).toBe(3);
  });

  /**
   * Test que verifica el funcionamiento del método `clearCart` del servicio `CartService`.
   * Este test asegura que el carrito se vacíe correctamente.
   * @test
   * @name should clear the cart
   * @description Este test asegura que el método `clearCart` en el servicio `CartService`
   *              vacíe correctamente el carrito de compras.
   * @given El servicio `CartService` con productos en el carrito.
   * @when Se llama al método `clearCart`.
   * @then El carrito de compras debería estar vacío.
   * @example 
   * service.clearCart();
   * expect(service.shoppingCart.length).toBe(0);
   */
  it('should clear the cart', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);
    service.clearCart();

    expect(service.shoppingCart.length).toBe(0);
  });

  /**
   * Test que verifica el funcionamiento del método `getTotal` del servicio `CartService`.
   * Este test asegura que el total del carrito de compras se calcule correctamente.
   * @test
   * @name should calculate total price of the cart
   * @description Este test asegura que el método `getTotal` en el servicio `CartService`
   *              calcule correctamente el precio total del carrito.
   * @given El servicio `CartService` con productos en el carrito.
   * @when Se llama al método `getTotal`.
   * @then El precio total del carrito debería ser calculado correctamente.
   * @example 
   * const total = service.getTotal();
   * expect(total).toBe(100); // Asumiendo un producto con precio 50 y cantidad 2
   */
  it('should calculate total price of the cart', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);
    const total = service.getTotal();

    expect(total).toBe(100); // 50 * 2
  });

  /**
   * Test que verifica el funcionamiento del método `genereteDetails` del servicio `CartService`.
   * Este test asegura que se genere correctamente una cadena con los detalles de los productos del carrito.
   * @test
   * @name should generate product details string
   * @description Este test asegura que el método `genereteDetails` en el servicio `CartService`
   *              genere correctamente una cadena con los detalles de los productos en el carrito.
   * @given El servicio `CartService` con productos en el carrito.
   * @when Se llama al método `genereteDetails`.
   * @then Se debe generar una cadena con los detalles del carrito.
   * @example 
   * const details = service.genereteDetails();
   * expect(details).toContain('Carrete de Pesca');
   */
  it('should generate product details string', () => {
    const product: Product = new Product();
    product.nombre = 'Carrete de Pesca';
    product.precio = 50;
    product.cantidad = 2;
    product.categoria = 'Pesca';
    product.descripcion = 'Carrete de pesca de alta calidad.';
    product.UID = '123abc';

    service.addProductToCart(product);
    const details = service.genereteDetails();

    expect(details).toContain('Carrete de Pesca - 2 unidades - $50€ c/u');
  });
});
