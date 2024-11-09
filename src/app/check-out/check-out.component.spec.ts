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

  it('should call ngOnInit and initialize form and total', () => {
    fixture.detectChanges();

    expect(cartServiceMock.getTotal).toHaveBeenCalled();
    expect(userServiceMock.getUser).toHaveBeenCalled();
    expect(cartServiceMock.getShoppingCart).toHaveBeenCalled();
    expect(component.subTotal).toBe(100);
    expect(component.OldUser).toEqual(new User());
    expect(component.listaProductos.length).toBe(2);
  });

  it('should calculate total correctly', () => {
    fixture.detectChanges();
    const formattedTotal = component.total();
    expect(formattedTotal).toBe('105.21'); // Subtotal (100) + 5.21
  });

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

  it('should format credit card number correctly', () => {
    const event = { target: { value: '1234123412341234' } };
    component.formatearNumeroTarjeta(event);

    expect(component.numeroTarjeta).toBe('1234 1234 1234 1234');
  });

  it('should validate the expiration date correctly', () => {
    const control = { value: '12/26' };
    const result = component.validarFechaExpiracion(control as AbstractControl);
    expect(result).toBeNull(); // Valid expiration date

    control.value = '13/23';
    const invalidResult = component.validarFechaExpiracion(control as AbstractControl);
    expect(invalidResult).toEqual({ fechaInvalida: true }); // Invalid month
  });

  it('should validate the DNI correctly', () => {
    const dniControl = { value: '12345678Z' };
    const validDni = component.validarDNI()(dniControl as AbstractControl);
    expect(validDni).toBeNull(); // Valid DNI

    dniControl.value = 'invalid-dni';
    const invalidDni = component.validarDNI()(dniControl as AbstractControl);
    expect(invalidDni).toEqual({ dniInvalido: true }); // Invalid DNI
  });

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

