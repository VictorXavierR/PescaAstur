import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../service/auth.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { firebaseConfig } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Importa el módulo aquí
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { RouterModule } from '@angular/router'; // Agrega RouterModule aquí

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [
        AngularFireModule.initializeApp(firebaseConfig), // Asegúrate de usar la configuración correcta
        AngularFireAuthModule,
        FormsModule,
        RouterModule.forRoot([]) // Usar RouterModule para pruebas sin rutas
      ],
      providers: [
        AuthService,
        Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should call sendPasswordReset with the correct email on success', async () => {
    const email = 'test@example.com';
    component.email = email;

    // Hacer que el método sendPasswordReset devuelva una promesa resuelta
    spyOn(authService, 'sendPasswordReset').and.returnValue(Promise.resolve());

    spyOn(console, 'log'); // Espiar el console.log

    // Llamar al método sendPasswordReset
    await component.sendPasswordReset();

    // Verificar que el método del servicio fue llamado con el correo correcto
    expect(authService.sendPasswordReset).toHaveBeenCalledWith(email);

    // Verificar que el mensaje de éxito se haya mostrado
    expect(console.log).toHaveBeenCalledWith('Correo de recuperación enviado correctamente.');
  });

  it('should handle error if sendPasswordReset fails', async () => {
    const email = 'test@example.com';
    component.email = email;

    // Simular una respuesta con error
    const errorMessage = 'Error al enviar el correo.';
    spyOn(authService, 'sendPasswordReset').and.returnValue(Promise.reject(new Error(errorMessage)));

    spyOn(console, 'log'); // Espiar el console.log

    // Llamar al método sendPasswordReset
    await component.sendPasswordReset();

    // Verificar que el método del servicio fue llamado con el correo correcto
    expect(authService.sendPasswordReset).toHaveBeenCalledWith(email);
  });
});

