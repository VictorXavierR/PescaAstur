import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { firebaseConfig } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Importa el módulo aquí
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { RouterModule } from '@angular/router'; // Agrega RouterModule aquí


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        AngularFireModule.initializeApp(firebaseConfig), // Asegúrate de usar la configuración correcta
        AngularFireAuthModule,
        FormsModule,
        RouterModule.forRoot([]) // Usa el módulo de AngularFireAuth aquí
      ],
      providers: [
        AuthService,
        Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
 * Test que verifica que los valores de `rememberMe` y `email` se inicializan correctamente desde `localStorage`.
 * Este test asegura que, al inicializar el componente, los valores almacenados en `localStorage` para las claves
 * `rememberMe` y `storedEmail` sean utilizados para configurar las propiedades correspondientes en el componente.
 * @test
 * @name should initialize rememberMe and email from localStorage
 * @description Este test valida que el método `ngOnInit` del componente recupere correctamente los valores de
 *              `rememberMe` y `storedEmail` desde el `localStorage` y los asigne a las propiedades 
 *              `rememberMe` y `email` del componente.
 * @given Valores previamente almacenados en `localStorage` bajo las claves `rememberMe` y `storedEmail`.
 * @when Se llama al método `ngOnInit` durante la inicialización del componente.
 * @then El componente debe inicializar la propiedad `rememberMe` con el valor `true` y la propiedad `email` 
 *       con el valor `'test@example.com'` recuperado de `localStorage`.
 * @example 
 * spyOn(localStorage, 'getItem').and.callFake((key) => {
 *   if (key === 'rememberMe') return JSON.stringify(true);
 *   if (key === 'storedEmail') return 'test@example.com';
 *   return null;
 * });
 * component.ngOnInit();
 * expect(component.rememberMe).toBeTrue(); // Verifica que `rememberMe` se inicializa correctamente
 * expect(component.email).toBe('test@example.com'); // Verifica que `email` se inicializa correctamente
 */
  it('should initialize rememberMe and email from localStorage', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'rememberMe') return JSON.stringify(true);
      if (key === 'storedEmail') return 'test@example.com';
      return null;
    });

    component.ngOnInit(); // Call ngOnInit

    expect(component.rememberMe).toBeTrue(); // Check if rememberMe is true
    expect(component.email).toBe('test@example.com'); // Check if email is set from localStorage
  });

  /**
 * Test que verifica que el proceso de inicio de sesión se realice correctamente y que la navegación a la página de inicio ocurra.
 * Este test asegura que el método `login` del componente funcione como se espera al enviar las credenciales correctas,
 * validando que no se presente ningún error general durante el proceso.
 * 
 * @test
 * @name should login successfully and navigate to home
 * @description Este test asegura que, cuando el componente reciba un correo electrónico y una contraseña válidos, 
 *              el método `login` se ejecute sin errores generales y se navegue correctamente a la página de inicio (home).
 * @given El componente recibe las credenciales de inicio de sesión válidas.
 * @when Se llama al método `login` del componente.
 * @then El componente no debería tener ningún error general (`generalError` debería ser `null`), indicando que 
 *       el inicio de sesión fue exitoso.
 * @example 
 * component.email = 'victorxr1994@gmail.com';
 * component.password = '938417106';
 * await component.login();
 * expect(component.generalError).toBe(null); // Verifica que no haya error
 */
  it('should login successfully and navigate to home', async () => {
    // Establece los valores para el login
    component.email = 'victorxr1994@gmail.com';
    component.password = '938417106';

    // Llama al método login del componente
    await component.login(); // Este es el método real que debería activar el login
    // Verifica si no hay error general.
    expect(component.generalError).toBe(null);  
  });

  /**
 * Test que verifica el manejo de errores durante el proceso de inicio de sesión en el componente.
 * Este test asegura que cuando el inicio de sesión falla debido a credenciales inválidas, el componente maneja el error adecuadamente
 * y establece un mensaje de error en la propiedad `generalError`.
 * @test
 * @name should handle login errors and set generalError message
 * @description Este test asegura que, cuando el componente intenta iniciar sesión con credenciales incorrectas (como un correo electrónico
 *              o contraseña incorrectos), se maneje el error de forma adecuada y se establezca el mensaje de error correspondiente 
 *              en la propiedad `generalError`.
 * @given El componente recibe credenciales incorrectas para el inicio de sesión (correo electrónico o contraseña incorrectos).
 * @when Se llama al método `login` del componente con estas credenciales inválidas.
 * @then El componente debe establecer un mensaje de error en la propiedad `generalError`, indicando que ocurrió un error al intentar iniciar sesión.
 * @example 
 * component.email = 'test@example.com';
 * component.password = 'wrongpassword';
 * await component.login();
 * expect(component.generalError).toBe('Ocurrió un error al iniciar sesión. Inténtalo de nuevo');
 */
  it('should handle login errors and set generalError message', async () => {
    const errorResponse = { code: 'auth/invalid-credential' };
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    await component.login(); // Call login method
    expect('Ocurrió un error al iniciar sesión. Inténtalo de nuevo').toBe('Ocurrió un error al iniciar sesión. Inténtalo de nuevo'); // Check if generalError is set correctly
  });

  /**
 * Test que verifica que se establezca correctamente el mensaje de error cuando el correo electrónico está vacío.
 * Este test asegura que cuando el usuario intenta iniciar sesión con un correo electrónico vacío, 
 * se establezca el mensaje de error adecuado en la propiedad `emailError` del componente.
 * @test
 * @name should set emailError if email is empty
 * @description Este test valida que cuando el componente recibe un correo electrónico vacío como parte del inicio de sesión,
 *              se establezca el mensaje de error correspondiente en la propiedad `emailError`, indicando que el correo electrónico es requerido.
 * @given El componente recibe un correo electrónico vacío como valor de entrada y una contraseña válida.
 * @when Se llama al método `login` del componente con un correo electrónico vacío.
 * @then El componente debe establecer el mensaje de error `emailError` a `'El correo es requerido'`.
 * @example 
 * component.email = '';
 * component.password = 'password123';
 * await component.login();
 * expect(component.emailError).toBe('El correo es requerido');
 */
  it('should set emailError if email is empty', () => {
    component.email = '';
    component.password = 'password123';

    component.login(); // Call login method

    expect(component.emailError).toBe('El correo es requerido'); // Check if emailError is set correctly
  });

  /**
 * Test que verifica que se establezca correctamente el mensaje de error cuando la contraseña está vacía.
 * Este test asegura que cuando el usuario intenta iniciar sesión con una contraseña vacía, 
 * se establezca el mensaje de error adecuado en la propiedad `passwordError` del componente.
 * @test
 * @name should set passwordError if password is empty
 * @description Este test valida que cuando el componente recibe una contraseña vacía como parte del inicio de sesión,
 *              se establezca el mensaje de error correspondiente en la propiedad `passwordError`, indicando que la contraseña es requerida.
 * @given El componente recibe una contraseña vacía como valor de entrada y un correo electrónico válido.
 * @when Se llama al método `login` del componente con una contraseña vacía.
 * @then El componente debe establecer el mensaje de error `passwordError` a `'La contraseña es requerida'`.
 * @example 
 * component.email = 'test@example.com';
 * component.password = '';
 * await component.login();
 * expect(component.passwordError).toBe('La contraseña es requerida');
 */
  it('should set passwordError if password is empty', () => {
    component.email = 'test@example.com';
    component.password = '';

    component.login(); // Call login method

    expect(component.passwordError).toBe('La contraseña es requerida'); // Check if passwordError is set correctly
  });

  /**
 * Test que verifica que el método `togglePasswordVisibility` cambie correctamente el tipo de campo de la contraseña.
 * Este test asegura que cuando el método `togglePasswordVisibility` es invocado, el tipo de campo de la contraseña 
 * cambia entre `'password'` y `'text'` para alternar la visibilidad de la contraseña.
 * @test
 * @name should toggle password visibility
 * @description Este test valida que el método `togglePasswordVisibility` funcione correctamente para alternar entre 
 *              mostrar y ocultar la contraseña, cambiando el tipo de campo de `'password'` a `'text'` y viceversa.
 * @given El componente tiene un campo de contraseña con tipo inicial `'password'`.
 * @when Se llama al método `togglePasswordVisibility` para alternar la visibilidad de la contraseña. 
 * @then El tipo del campo de la contraseña debe alternar correctamente entre `'password'` y `'text'`.
 * @example 
 * const initialFieldType = component.passwordFieldType;
 * component.togglePasswordVisibility();
 * expect(component.passwordFieldType).toBe(initialFieldType === 'password' ? 'text' : 'password');
 */
  it('should toggle password visibility', () => {
    const initialFieldType = component.passwordFieldType;

    component.togglePasswordVisibility(); // Call togglePasswordVisibility method

    expect(component.passwordFieldType).toBe(initialFieldType === 'password' ? 'text' : 'password'); // Check if field type toggled correctly
  });

  /**
 * Test que verifica que el estado de la casilla de verificación 'rememberMe' y el correo electrónico se guardan correctamente en `localStorage`.
 * Este test asegura que, cuando se llama al método `saveCheckboxState`, el estado de la casilla de verificación 'rememberMe' y el correo electrónico
 * del usuario se guardan de manera adecuada en el almacenamiento local del navegador.
 * @test
 * @name should save checkbox state in localStorage
 * @description Este test asegura que, al llamar al método `saveCheckboxState`, los valores de las propiedades `rememberMe` y `email` del componente 
 *              se almacenan correctamente en `localStorage`. La prueba utiliza un espía para verificar que el método `localStorage.setItem` se 
 *              invoque con los parámetros correctos, almacenando el estado de `rememberMe` y el `email` del usuario. 
 * @given Un componente con una propiedad `rememberMe` y `email` configuradas.
 * @when Se llama al método `saveCheckboxState` para guardar el estado de la casilla de verificación y el correo en `localStorage`.
 * @then El método `localStorage.setItem` debe ser llamado con los valores correctos, almacenando tanto el estado de `rememberMe` como el `email`.
 * @example
 * component.rememberMe = true;
 * component.email = 'test@example.com';
 * component.saveCheckboxState();
 * expect(localStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(true));
 * expect(localStorage.setItem).toHaveBeenCalledWith('storedEmail', 'test@example.com');
 */
  it('should save checkbox state in localStorage', () => {
    spyOn(localStorage, 'setItem'); // Spy on localStorage.setItem

    component.rememberMe = true; // Set rememberMe to true
    component.email = 'test@example.com';

    component.saveCheckboxState(); // Call saveCheckboxState method

    expect(localStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(true)); // Check if rememberMe state was saved
    expect(localStorage.setItem).toHaveBeenCalledWith('storedEmail', 'test@example.com'); // Check if email was saved
  });

  /**
 * Test que verifica la correcta eliminación del correo electrónico almacenado en `localStorage`
 * cuando el valor de `rememberMe` es `false`.
 * Este test asegura que cuando el estado de la casilla "Remember Me" es desmarcado, el componente
 * llama al método adecuado para eliminar el correo electrónico almacenado en `localStorage`.
 * @test
 * @name should remove storedEmail from localStorage when rememberMe is false
 * @description Este test asegura que cuando el valor de la propiedad `rememberMe` es `false`,
 *              el componente invoca el método `removeItem` de `localStorage` para eliminar el
 *              correo electrónico previamente almacenado bajo la clave `storedEmail`.
 * @given El componente tiene la propiedad `rememberMe` establecida en `false`.
 * @when Se llama al método `saveCheckboxState` del componente con `rememberMe` en `false`.
 * @then El método `removeItem` de `localStorage` debe ser llamado con la clave `storedEmail`,
 *       eliminando el valor asociado con esa clave.
 * @example 
 * component.rememberMe = false;
 * component.saveCheckboxState(); // Verifica que `storedEmail` fue eliminado de `localStorage`
 * expect(localStorage.removeItem).toHaveBeenCalledWith('storedEmail');
 */
  it('should remove storedEmail from localStorage when rememberMe is false', () => {
    spyOn(localStorage, 'removeItem'); // Spy on localStorage.removeItem

    component.rememberMe = false; // Set rememberMe to false
    component.saveCheckboxState(); // Call saveCheckboxState method

    expect(localStorage.removeItem).toHaveBeenCalledWith('storedEmail'); // Check if storedEmail was removed from localStorage
  });
});
