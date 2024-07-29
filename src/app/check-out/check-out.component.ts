import { Component } from '@angular/core';
import { CartService } from '../service/cart.service';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      DNI: [this.OldUser.DNI, Validators.required],
      email: [this.OldUser.email, [Validators.required, Validators.email]],
      telefono: [this.OldUser.telefono, Validators.required],
      direccion: [this.OldUser.direccion, Validators.required],
      codigoPostal: [this.OldUser.codigoPostal, Validators.required],
      pais: [this.OldUser.pais, Validators.required],
      provincia: [this.OldUser.provincia, Validators.required],
    });
    this.userForm.disable();
  }

  editable() {
    this.editarDatos = !this.editarDatos;
    if (this.editarDatos) {
      this.userForm.enable(); // Habilitar el formulario para edición
    } else {
      this.userForm.disable(); // Deshabilitar el formulario cuando no está en edición
    }
  }

  guardarDatos() {
    if (this.userForm.valid) {
      this.OldUser = this.userForm.value; // Guardar los datos del formulario
      this.userService.setUser(this.OldUser); // Actualizar el usuario en el servicio
      this.editarDatos = false;
    }
  }

  cancelar() {
    this.userForm.reset(this.OldUser); // Restaurar los valores originales
    this.editarDatos = false;
  }

  total() {
    return this.precioFinal = this.subTotal + 5.21;
  }

  tramitarPedido() {
    const datosBancariosOcultos = this.ocultarDatos(this.titularTarjeta, this.numeroTarjeta, this.fechaExpiracion, this.codigoSeguridad);
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

  ocultarDatos(titular: string, numero: string, fecha: string, codigo: string): string {
    const titularOculto = titular.replace(/.(?=.{4})/g, 'x');
    const numeroOculto = numero.replace(/.(?=.{4})/g, 'x');
    const fechaOculta = fecha.replace(/.(?=.{2})/g, 'x');
    const codigoOculto = codigo.replace(/.(?=.{2})/g, 'x');
  
    return `
      Datos Bancarios:
      Titular: ${titularOculto}
      Número de Tarjeta: ${numeroOculto}
      Fecha de Expiración: ${fechaOculta}
      Código de Seguridad: ${codigoOculto}
    `;
  }
}
