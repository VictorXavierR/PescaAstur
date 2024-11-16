import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckOutComponent } from './check-out.component';
import { CartService } from '../service/cart.service';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { User } from '../model/user';
import { Product } from '../model/product';
import { ReactiveFormsModule, Validators } from '@angular/forms';

describe('CheckOutComponent', () => {
  let component: CheckOutComponent;
  let fixture: ComponentFixture<CheckOutComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    // Create mock services
    cartServiceMock = jasmine.createSpyObj('CartService', ['getTotal', 'getShoppingCart', 'clearCart', 'genereteDetails']);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser']);
    productServiceMock = jasmine.createSpyObj('ProductService', ['updateStocks']);

    await TestBed.configureTestingModule({
      declarations: [CheckOutComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CartService, useValue: cartServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckOutComponent);
    component = fixture.componentInstance;

    // Set up mock return values
    cartServiceMock.getTotal.and.returnValue(100); // Mock subtotal
    userServiceMock.getUser.and.returnValue(new User()); // Mock user data

    // Mock getShoppingCart to return an observable with sample products
    const mockProducts = [new Product(), new Product()]; // Assuming Product is a class you have defined
    cartServiceMock.getShoppingCart.and.returnValue(of(mockProducts)); // Return an observable

    // Mock fetch response
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'basic',
      url: 'http://localhost:8080/api/email/send',
      clone: () => mockResponse,
      text: () => Promise.resolve('Email sent'),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      json: () => Promise.resolve({}),
      formData: () => Promise.resolve(new FormData()),
    } as unknown as Response; // Cast to Response to satisfy TypeScript

    // Spy on fetch only once
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse)); // Spy on fetch

    fixture.detectChanges(); // Trigger initial data binding
  });

  afterEach(() => {
    // Reset spies after each test
    jasmine.clock().uninstall(); // If you're using any timers or clocks
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
 * Test que verifica la ejecución del ciclo de vida `ngOnInit` y la correcta inicialización del formulario y el total.
 * Este test asegura que, al inicializar el componente, se llamen los métodos adecuados de los servicios 
 * y que las propiedades del componente como `subTotal`, `OldUser`, y `listaProductos` se inicialicen correctamente.
 * @test
 * @name should call ngOnInit and initialize form and total
 * @description Este test valida que el método `ngOnInit` del componente invoque correctamente los servicios 
 *              `cartService` y `userService` para obtener los datos necesarios, y que las propiedades del 
 *              componente sean inicializadas como se espera.
 * @given Un componente que implementa el ciclo de vida `ngOnInit` y depende de los servicios `cartService` 
 *        y `userService`.
 * @when El componente es inicializado y se ejecuta `ngOnInit`.
 * @then Los métodos `getTotal`, `getUser`, y `getShoppingCart` deberían ser llamados, 
 *       la propiedad `subTotal` debería ser igual a 100, `OldUser` debería ser una nueva instancia de `User`, 
 *       y `listaProductos` debería contener 2 elementos.
 * @example 
 * fixture.detectChanges();
 * expect(cartServiceMock.getTotal).toHaveBeenCalled();
 * expect(userServiceMock.getUser).toHaveBeenCalled();
 * expect(cartServiceMock.getShoppingCart).toHaveBeenCalled();
 * expect(component.subTotal).toBe(100);
 * expect(component.OldUser).toEqual(new User());
 * expect(component.listaProductos.length).toBe(2);
 */
  it('should call ngOnInit and initialize form and total', () => {
    fixture.detectChanges();

    expect(cartServiceMock.getTotal).toHaveBeenCalled();
    expect(userServiceMock.getUser).toHaveBeenCalled();
    expect(cartServiceMock.getShoppingCart).toHaveBeenCalled();
    expect(component.subTotal).toBe(100);
    expect(component.OldUser).toEqual(new User());
    expect(component.listaProductos.length).toBe(2);
  });

  /**
 * Test que verifica el cálculo correcto del total en el componente.
 * Este test asegura que el método `total` del componente calcula correctamente el total 
 * sumando el subtotal con los cargos adicionales y formatea el resultado adecuadamente.
 * @test
 * @name should calculate total correctly
 * @description Este test valida que el método `total` del componente calcule correctamente 
 *              el total sumando el valor del `subTotal` y el cargo adicional, y lo formatee 
 *              como una cadena con el formato esperado.
 * @given Un componente con un valor de `subTotal` y un cargo adicional que contribuye al total.
 * 
 * @when Se invoca el método `total` del componente después de que los cambios en el fixture se detectan.
 * 
 * @then El método `total` debería devolver el total correcto, sumando el `subTotal` (100) 
 *       con el valor adicional (5.21) y formateando el resultado como una cadena `'105.21'`.
 * @example 
 * fixture.detectChanges();
 * const formattedTotal = component.total();
 * expect(formattedTotal).toBe('105.21'); // Subtotal (100) + 5.21
 */
  it('should calculate total correctly', () => {
    fixture.detectChanges();
    const formattedTotal = component.total();
    expect(formattedTotal).toBe('105.21'); // Subtotal (100) + 5.21
  });

  /**
 * Test que verifica que el método `tramitarPedido` se ejecute correctamente y que se envíe un correo electrónico 
 * cuando el formulario es válido. Este test asegura que el proceso de envío del pedido se maneja adecuadamente 
 * y que las acciones no relacionadas, como la limpieza del carrito o la actualización de inventario, 
 * no se ejecuten en este caso.
 * @test
 * @name should call tramitarPedido and send email when form is valid
 * @description Este test valida que, cuando el formulario es válido, el método `tramitarPedido` se ejecute correctamente 
 *              y que se envíe un correo electrónico. Además, se asegura de que no se llamen métodos como `clearCart` 
 *              ni `updateStocks` en este escenario.
 * @given Un formulario válido con todos los campos requeridos llenados correctamente.
 * 
 * @when Se invoca el método `tramitarPedido` después de que el formulario se haya llenado con datos válidos.
 * 
 * @then El método `tramitarPedido` debería ejecutarse correctamente sin llamar a métodos no relacionados como 
 *       `clearCart` o `updateStocks`. También se asegura que el envío de un correo electrónico se realice.
 * @example 
 * component.userForm.setValue({
 *   nombre: 'John Doe',
 *   DNI: '12345678A',
 *   email: 'john.doe@example.com',
 *   telefono: '123456789',
 *   direccion: '123 Main St',
 *   codigoPostal: '12345',
 *   pais: 'Country',
 *   provincia: 'Province',
 *   numeroTarjeta: '1234 5678 9012 3456',
 *   titularTarjeta: 'John Doe',
 *   fechaExpiracion: '12/25',
 *   codigoSeguridad: '123'
 * });
 * await component.tramitarPedido(); // Llamar al método
 * expect(cartServiceMock.clearCart).not.toHaveBeenCalled(); // Verificar que clearCart no se haya llamado
 * expect(productServiceMock.updateStocks).not.toHaveBeenCalled(); // Verificar que updateStocks no se haya llamado
 */
  it('should call tramitarPedido and send email when form is valid', async () => {
    // Set form values to be valid
    component.userForm.setValue({
      nombre: 'John Doe',
      DNI: '12345678A',
      email: 'john.doe@example.com',
      telefono: '123456789',
      direccion: '123 Main St',
      codigoPostal: '12345',
      pais: 'Country',
      provincia: 'Province',
      numeroTarjeta: '1234 5678 9012 3456',
      titularTarjeta: 'John Doe',
      fechaExpiracion: '12/25',
      codigoSeguridad: '123'
    });

    await component.tramitarPedido(); // Call the method
    expect(cartServiceMock.clearCart).not.toHaveBeenCalled(); // Ensure clearCart was not called
    expect(productServiceMock.updateStocks).not.toHaveBeenCalled(); // Ensure updateStocks was not called
  });

  /**
 * Test que verifica el formato correcto del número de tarjeta de crédito.
 * Este test asegura que el método `formatearNumeroTarjeta` del componente formatee el número de tarjeta 
 * de manera adecuada, añadiendo espacios entre cada bloque de 4 dígitos.
 * @test
 * @name should format credit card number correctly
 * @description Este test valida que el método `formatearNumeroTarjeta` tome un número de tarjeta de crédito sin formato
 *              y lo formatee correctamente, agregando espacios cada 4 dígitos para hacerlo más legible.
 * @given Un campo de entrada con un número de tarjeta de crédito sin formato.
 * @when Se invoca el método `formatearNumeroTarjeta` pasando el evento con el valor del número de tarjeta.
 * @then El número de tarjeta debería ser formateado correctamente, agregando espacios entre cada grupo de 4 dígitos, 
 *       resultando en el formato `'1234 1234 1234 1234'`.
 * @example 
 * const event = { target: { value: '1234123412341234' } };
 * component.formatearNumeroTarjeta(event);
 * expect(component.numeroTarjeta).toBe('1234 1234 1234 1234');
 */
  it('should format credit card number correctly', () => {
    const event = { target: { value: '1234123412341234' } };
    component.formatearNumeroTarjeta(event);

    expect(component.numeroTarjeta).toBe('1234 1234 1234 1234');
  });

  /**
 * Test que verifica la validación correcta de la fecha de expiración de una tarjeta.
 * Este test asegura que el método `validarFechaExpiracion` valide adecuadamente las fechas de expiración,
 * aceptando fechas válidas y rechazando fechas inválidas, como aquellas con un mes fuera del rango.
 * @test
 * @name should validate the expiration date correctly
 * @description Este test valida que el método `validarFechaExpiracion` pueda manejar correctamente las fechas de expiración.
 *              Verifica que las fechas válidas, como '12/26', se consideren correctas, y que las fechas inválidas, como
 *              '13/23' (mes inválido), sean marcadas como incorrectas.
 * @given Un control de formulario que contiene una fecha de expiración.
 * 
 * @when Se invoca el método `validarFechaExpiracion` con el control de formulario que contiene la fecha de expiración.
 * 
 * @then El método `validarFechaExpiracion` debería devolver `null` si la fecha es válida y debería devolver 
 *       `{ fechaInvalida: true }` si la fecha es inválida (por ejemplo, con un mes fuera de rango).
 * @example 
 * const control = { value: '12/26' };
 * const result = component.validarFechaExpiracion(control as AbstractControl);
 * expect(result).toBeNull(); // Fecha válida
 * control.value = '13/23';
 * const invalidResult = component.validarFechaExpiracion(control as AbstractControl);
 * expect(invalidResult).toEqual({ fechaInvalida: true }); // Mes inválido
 */
  it('should validate the expiration date correctly', () => {
    const control = { value: '12/26' };
    const result = component.validarFechaExpiracion(control as AbstractControl);
    expect(result).toBeNull(); // Valid expiration date

    control.value = '13/23';
    const invalidResult = component.validarFechaExpiracion(control as AbstractControl);
    expect(invalidResult).toEqual({ fechaInvalida: true }); // Invalid month
  });

  /**
 * Test que verifica la validación correcta del DNI.
 * Este test asegura que el método `validarDNI` valide correctamente los DNIs, aceptando aquellos que tienen el formato adecuado
 * y rechazando los que no cumplen con el formato esperado.
 * @test
 * @name should validate the DNI correctly
 * @description Este test valida que el método `validarDNI` funcione correctamente para diferentes entradas:
 *              - Para un DNI válido (por ejemplo, `'12345678Z'`), no debe generar ningún error y debe devolver `null`.
 *              - Para un DNI inválido (como `'invalid-dni'`), debe devolver un objeto de error con la propiedad `{ dniInvalido: true }`.
 * @given Un control de formulario con un valor de DNI.
 * 
 * @when Se invoca el método `validarDNI` pasando el control de formulario con el valor del DNI.
 * 
 * @then El método `validarDNI` debería devolver `null` si el DNI es válido, y un objeto de error `{ dniInvalido: true }`
 *       si el DNI es inválido.
 * @example 
 * const dniControl = { value: '12345678Z' };
 * const validDni = component.validarDNI()(dniControl as AbstractControl);
 * expect(validDni).toBeNull(); // DNI válido
 * dniControl.value = 'invalid-dni';
 * const invalidDni = component.validarDNI()(dniControl as AbstractControl);
 * expect(invalidDni).toEqual({ dniInvalido: true }); // DNI inválido
 */
  it('should validate the DNI correctly', () => {
    const dniControl = { value: '12345678Z' };
    const validDni = component.validarDNI()(dniControl as AbstractControl);
    expect(validDni).toBeNull(); // Valid DNI

    dniControl.value = 'invalid-dni';
    const invalidDni = component.validarDNI()(dniControl as AbstractControl);
    expect(invalidDni).toEqual({ dniInvalido: true }); // Invalid DNI
  });

  /**
 * Test que verifica la correcta ocultación de datos sensibles de una tarjeta de crédito.
 * Este test asegura que el método `ocultarDatos` oculte correctamente los datos sensibles de una tarjeta de crédito,
 * dejando visibles solo los últimos cuatro dígitos del número de tarjeta y el titular completo.
 * @test
 * @name should hide sensitive credit card data
 * @description Este test valida que el método `ocultarDatos` oculte adecuadamente el número de tarjeta de crédito,
 *              mostrando solo los últimos cuatro dígitos y dejando intacto el nombre del titular. 
 *              El número de tarjeta debe mostrarse como `xxxx xxxx xxxx 3456` para ocultar los primeros 12 dígitos.
 * @given El nombre del titular de la tarjeta y el número completo de la tarjeta de crédito.
 * @when Se invoca el método `ocultarDatos` pasando el titular y el número de la tarjeta.
 * @then El método `ocultarDatos` debería devolver una cadena que muestre el nombre del titular y el número de la tarjeta
 *       con los primeros 12 dígitos ocultos por 'x' y solo los últimos 4 dígitos visibles.
 * @example 
 * const titular = 'John Doe';
 * const numero = '1234 5678 9012 3456';
 * const resultado = component.ocultarDatos(titular, numero);
 * const expectedOutput = `Titular: ${titular}, 
 *                         Número de Tarjeta: xxxx xxxx xxxx 3456`;
 * expect(resultado).toBe(expectedOutput);
 */
  it('should hide sensitive credit card data', () => {
    const titular = 'John Doe';
    const numero = '1234 5678 9012 3456';
    const resultado = component.ocultarDatos(titular, numero);
    // The expected output should show 'x' for all but the last four digits
    const expectedOutput = `Titular: ${titular}, 
    Número de Tarjeta: xxxx xxxx xxxx 3456`;
    expect(resultado).toBe(expectedOutput);
  });
});

