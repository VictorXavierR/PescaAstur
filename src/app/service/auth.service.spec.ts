import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  

describe('AuthService', () => {
  let service: AuthService;
  let afAuth: AngularFireAuth;

  beforeEach(() => {
    // Configurar el entorno de pruebas con Firebase
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),  // Usar la configuración correcta
        AngularFireAuthModule,  // Asegurarse de importar el módulo de autenticación
      ],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    afAuth = TestBed.inject(AngularFireAuth); // Inyectar el servicio real
  });

  /**
   * Test que verifica el funcionamiento del método `login` del servicio `AuthService`.
   * Este test asegura que el método `login` invoque correctamente el método 
   * `signInWithEmailAndPassword` de `AngularFireAuth` y devuelva un resultado correcto.
   *
   * @test
   * @name should log in a user with email and password
   * @description Este test asegura que el método `login` en el servicio `AuthService`
   *              llame al método `signInWithEmailAndPassword` de `AngularFireAuth` 
   *              correctamente y que devuelva la respuesta esperada.
   * 
   * @given El servicio `AuthService` y un email y contraseña válidos.
   * 
   * @when Se llama al método `login` con los parámetros email y password.
   * 
   * @then El método `login` debería devolver la respuesta esperada de Firebase.
   * 
   * @example 
   * const result = await service.login('user@example.com', 'password123');
   * expect(result).toBeDefined();
   */
  it('should log in a user with email and password', async () => {
    const result = await service.login('xavierrodriguezvictor@gmail.com', '938417106');
    expect(result).toBeDefined();
  });

  /**
   * Test que verifica el funcionamiento del método `logout` del servicio `AuthService`.
   * Este test asegura que el método `logout` invoque correctamente el método 
   * `signOut` de `AngularFireAuth` para cerrar la sesión del usuario.
   *
   * @test
   * @name should log out a user
   * @description Este test asegura que el método `logout` en el servicio `AuthService`
   *              llame al método `signOut` de `AngularFireAuth` para cerrar la sesión.
   * 
   * @given El servicio `AuthService` con un usuario autenticado.
   * 
   * @when Se llama al método `logout`.
   * 
   * @then El método `logout` debería cerrar la sesión correctamente.
   *
   * @example 
   * await service.logout();
   * expect(afAuth.signOut).toHaveBeenCalled();
   */
  it('should log out a user', async () => {
    await service.logout();
    expect(await afAuth.currentUser).toBeNull();
  });

  /**
 * Test que verifica el funcionamiento del método `sendPasswordReset` del servicio `AuthService`.
 * Este test asegura que el método `sendPasswordReset` invoque correctamente el método 
 * `sendPasswordResetEmail` de `AngularFireAuth` y maneje adecuadamente la promesa resultante.
 * @test
 * @name should send password reset email
 * @description Este test asegura que el método `sendPasswordReset` en el servicio `AuthService`
 *              llame al método `sendPasswordResetEmail` de `AngularFireAuth` correctamente.
 *              Además, la prueba verifica que la promesa se resuelva sin errores, lo que indica
 *              que el correo de restablecimiento de contraseña se envió con éxito.
 * @given El servicio `AuthService` y un email válido para el restablecimiento de contraseña.
 * 
 * @when Se llama al método `sendPasswordReset` con el email proporcionado.
 * 
 * @then El método `sendPasswordReset` debería llamar al método `sendPasswordResetEmail` de Firebase
 *       y la promesa devuelta debe resolverse sin errores.
 * @example 
 * await service.sendPasswordReset('user@example.com');
 * expect(true).toBeTrue(); // Verifica que la promesa se resolvió correctamente
 */
  it('should send password reset email', async () => {
    const email = 'xavierrodriguezvictor@gmail.com';
    
    try {
      await service.sendPasswordReset(email);
      // Si la promesa se resuelve correctamente, pasamos la prueba
      expect(true).toBeTrue();
    } catch (error) {
      // Si hay un error (como un error de red o un email incorrecto), fallará la prueba
      fail('Password reset email failed');
    }
  });
});
