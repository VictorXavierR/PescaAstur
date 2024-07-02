import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        // Usuario autenticado correctamente
        this.error = '';
        console.log('Inicio de sesión exitoso');
      })
      .catch(error => {
        // Manejo de errores de inicio de sesión
        console.error('Error de inicio de sesión:', error);
        this.error = error.message; // Mostrar mensaje de error al usuario
      });
  }
}
