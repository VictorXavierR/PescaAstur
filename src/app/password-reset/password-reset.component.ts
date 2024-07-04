import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  email: string = '';

  constructor(private authService: AuthService) {
  }

  sendPasswordReset() {
    this.authService.sendPasswordReset(this.email)
      .then(() => console.log('Correo de recuperación enviado correctamente.'))
      .catch((error: Error) => console.log(`Error al enviar el correo: ${error.message}`));
  }

}
