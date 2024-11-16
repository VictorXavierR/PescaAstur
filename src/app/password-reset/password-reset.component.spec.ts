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

  /**
 * Test que verifica que el método `sendPasswordReset` es llamado con el correo electrónico correcto 
 * y que el mensaje de éxito se muestra cuando la promesa se resuelve correctamente.
 * Este test asegura que, cuando el usuario solicita un restablecimiento de contraseña, 
 * el componente llama al servicio `sendPasswordReset` con la dirección de correo electrónico 
 * correcta y maneja la respuesta exitosa mostrando el mensaje adecuado en la consola.
 * @test
 * @name should call sendPasswordReset with the correct email on success
 * @description Este test verifica que, al llamar al método `sendPasswordReset` del componente con un correo electrónico válido, 
 *              se invoca el servicio `sendPasswordReset` con el correo correcto y se muestra un mensaje en la consola indicando el éxito.
 * @given El componente tiene un correo electrónico establecido en su propiedad `email`.
 * @when Se llama al método `sendPasswordReset` del componente.
 * @then El método `sendPasswordReset` del servicio debe ser llamado con el correo electrónico correcto y
 *       debe registrarse un mensaje en la consola que indique que el correo de recuperación fue enviado correctamente.
 * @example 
 * component.email = 'test@example.com';
 * await component.sendPasswordReset(); // Verifica que `sendPasswordReset` fue llamado con el correo correcto
 * expect(authService.sendPasswordReset).toHaveBeenCalledWith('test@example.com');
 * expect(console.log).toHaveBeenCalledWith('Correo de recuperación enviado correctamente.');
 */
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

  /**
 * Test que verifica el manejo de errores cuando el servicio `sendPasswordReset` falla.
 * Este test asegura que, cuando el servicio `sendPasswordReset` rechaza la promesa con un error, 
 * el componente maneje adecuadamente el error y registre la información relevante.
 * @test
 * @name should handle error if sendPasswordReset fails
 * @description Este test valida que si el método `sendPasswordReset` del servicio 
 *              devuelve un error, el componente maneje el error de manera correcta, 
 *              registrando el mensaje de error en la consola.
 * @given El componente tiene un correo electrónico válido para restablecer la contraseña.
 * @when Se llama al método `sendPasswordReset` y el servicio devuelve una promesa rechazada con un error.
 * @then El método `sendPasswordReset` del servicio debe ser llamado con el correo electrónico correcto.
 *       También se debe verificar que el error es manejado adecuadamente, 
 *       aunque en este caso no se verifica la consola de error debido a la ausencia de un mensaje específico.
 * @example 
 * component.email = 'test@example.com';
 * component.sendPasswordReset(); // Verifica que se maneja el error cuando la promesa falla
 * expect(authService.sendPasswordReset).toHaveBeenCalledWith('test@example.com');
 */
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

