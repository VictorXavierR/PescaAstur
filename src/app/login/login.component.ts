import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  emailError: string | null = null;
  passwordError: string | null = null;
  generalError: string | null = null;
  passwordFieldType: string = 'password';
  rememberMe: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Cargar estado del checkbox y correo desde localStorage al iniciar el componente
    const rememberMeValue = localStorage.getItem('rememberMe');
    this.rememberMe = rememberMeValue ? JSON.parse(rememberMeValue) : false;

    if (this.rememberMe) {
      const storedEmail = localStorage.getItem('storedEmail');
      this.email = storedEmail || '';
    }
  }

  login(){
    this.emailError = null;
    this.passwordError = null;
    this.generalError = null;
    if (!this.email) {
      this.emailError = 'El correo es requerido';
      return;
    }
    if (!this.password) {
      this.passwordError = 'La contraseña es requerida';
      return;
    }

    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .then(() => {
          // Usuario autenticado correctamente
          console.log('Inicio de sesión exitoso');
          this.generalError = '';
        })
        .catch(error => {
          // Manejo de errores de inicio de sesión
          console.error('Error de inicio de sesión:', error);
          this.handleError(error);
        });
    }
  }

  handleError(error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        this.emailError = 'El formato del correo electrónico no es válido';
        break;
      case 'auth/user-disabled':
        this.generalError = 'Este usuario ha sido deshabilitado';
        break;
      case 'auth/invalid-credential':
        this.passwordError = 'Usuario o contraseña incorrectos';
        break;
      default:
        this.generalError = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo';
        break;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  saveCheckboxState() {
    localStorage.setItem('rememberMe', JSON.stringify(this.rememberMe));
    if (this.rememberMe) {
      localStorage.setItem('storedEmail', this.email);
    } else {
      localStorage.removeItem('storedEmail');
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(result => {
      console.log('User signed in with Google:', result);
    }).catch(error => {
      console.error('Error signing in with Google:', error);
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().then(result => {
      console.log('User signed in with Facebook:', result);
    }).catch(error => {
      console.error('Error signing in with Facebook:', error);
    });
  }

  loginWithTwitter() {
    this.authService.loginWithTwitter().then(result => {
      console.log('User signed in with Twitter:', result);
    }).catch(error => {
      console.error('Error signing in with Twitter:', error);
    });
  }
}
