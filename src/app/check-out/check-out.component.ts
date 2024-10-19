import { Component } from '@angular/core';
import { CartService } from '../service/cart.service';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent {

  subTotal: number = 0;
  OldUser: User = new User();
  editarDatos: boolean = false;
  NewUser: User = new User();
  userForm!: FormGroup;
  precioFinal: number = 0;
  titularTarjeta: string = '';
  numeroTarjeta: string = '';
  fechaExpiracion: string = '';
  codigoSeguridad: string = '';
  pedidoDetalles: string = '';



  constructor(private cartService: CartService, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subTotal = this.cartService.getTotal();
    this.OldUser = this.userService.getUser();
    this.createForm();
    this.total();
    this.pedidoDetalles = this.cartService.genereteDetails();
  }

  createForm() {
    this.userForm = this.fb.group({
      nombre: [this.OldUser.nombre, Validators.required],
      DNI: [this.OldUser.DNI, [Validators.required, this.validarDNI()]], 
      email: [this.OldUser.email, [Validators.required, Validators.email]],
      telefono: [this.OldUser.telefono, [Validators.required, Validators.pattern(/^\d{9}$/)]], 
      direccion: [this.OldUser.direccion, Validators.required],
      codigoPostal: [this.OldUser.codigoPostal, [Validators.required, Validators.pattern(/^\d{5}$/)]], 
      pais: [this.OldUser.pais, Validators.required],
      provincia: [this.OldUser.provincia, Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      titularTarjeta: ['', Validators.required],
      fechaExpiracion: ['', [Validators.required, this.validarFechaExpiracion]],
      codigoSeguridad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }
  /**
   * Calcula el precio final del pedido, que incluye el precio total y los gastos de envío.
   * @returns Devuelve el precio final del pedido, que incluye el precio total y los gastos de envío.
   */
  total() {
    return this.precioFinal = this.subTotal + 5.21;
  }
  /**
   * Tramita el pedido y envía un correo electrónico al usuario con los detalles del pedido
   * y los datos bancarios para la transferencia.
   */
  tramitarPedido() {
    if (this.userForm.invalid) {
      this.logFormErrors();
      this.userForm.markAllAsTouched();
      return;
    }
    this.OldUser = { ...this.OldUser, ...this.userForm.value };
    const datosBancariosOcultos = this.ocultarDatos(this.titularTarjeta, this.numeroTarjeta);
    const emailBody = `
      <h1>Confirmación de Pedido: PescaAstur</h1>
      <p>Estimado/a ${this.OldUser.nombre},</p>
      <p>Gracias por tu pedido. Aquí tienes los detalles:</p>
      <p>${this.pedidoDetalles}</p>
      <p>Datos bancarios para la transferencia:</p>
      <p>${datosBancariosOcultos}</p>
      <p>Un cordial saludo,<br>El equipo de PescaAstur</p>
    `;

    fetch('http://localhost:8080/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: this.OldUser.email,
        subject: 'Confirmación de Pedido: PescaAstur',
        body: emailBody
      })
    })
      .then(response => response.text())
      .then(data => {
        console.log('Correo enviado:', data);
        alert('Pedido tramitado correctamente. Se ha enviado un correo con los detalles.');
        this.cartService.clearCart();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  /**
   * Oculta los datos sensibles de la tarjeta de crédito.
   * @param titular 
   * @param numero 
   * @returns Devuelve una cadena con los datos del titular y el número de tarjeta ocultos.
   */
  ocultarDatos(titular: string, numero: string): string {
    const numeroOculto = numero.replace(/.(?=.{4})/g, 'x');

    return `
  Titular: ${titular}, 
  Número de Tarjeta: ${numeroOculto}
  `;
  }
  /**
   * Formatea el número de la tarjeta de crédito para que se muestre con espacios cada 4 dígitos.
   * @param event Evento que contiene el valor del campo de la tarjeta de crédito. 
   */
  formatearNumeroTarjeta(event: any): void {
    let valor = event.target.value.replace(/\s+/g, ''); // Elimina los espacios existentes
    if (valor.length > 16) { // Máximo 16 dígitos
      valor = valor.slice(0, 16);
    }
    // Agrega un espacio cada 4 dígitos
    this.numeroTarjeta = valor.replace(/(.{4})/g, '$1 ').trim();
  }
  /**
   * Valida la fecha de expiración de la tarjeta de crédito.
   * @param control 
   * @returns Devuelve true si no es valida, y null si es válida.
   */
  validarFechaExpiracion(control: AbstractControl): ValidationErrors | null {
    const fechaExpiracion = control.value;
  
    // Si el campo está vacío, no realizamos la validación aquí (el campo requerido lo valida)
    if (!fechaExpiracion) {
      return null;
    }
  
    // Dividimos la fecha en mes y año
    const [mes, anio] = fechaExpiracion.split('/').map(Number);
  
    // Verifica si el mes y el año son válidos
    if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) {
      return { fechaInvalida: true }; // Mes fuera de rango
    }
  
    // Si el año es de dos dígitos, lo convertimos a cuatro dígitos
    const anioCompleto = anio < 100 ? 2000 + anio : anio;
  
    // Obtenemos la fecha actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son base 0
    const anioActual = fechaActual.getFullYear();
  
    // Comparamos el año primero, y luego el mes
    if (anioCompleto < anioActual || (anioCompleto === anioActual && mes < mesActual)) {
      return { fechaInvalida: true }; // Devuelve un error si la fecha es anterior a la actual
    }
  
    return null; // Si la fecha es válida
  }
  
  /**
   * Valida el DNI del usuario.
   * @returns Devuelve true sino es válido, y null si es válido.
   */
  validarDNI(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dniRegex = /^[0-9]{8}[A-Z]$/;
      const isValid = dniRegex.test(control.value);
      return isValid ? null : { dniInvalido: true };
    };
  }
  /**
   * Muestra los errores de validación del formulario en la consola.
   */
  logFormErrors() {
    Object.keys(this.userForm.controls).forEach(key => {
      const controlErrors = this.userForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`Control: ${key}, Errors: `, controlErrors);
      }
    });
  }
}
