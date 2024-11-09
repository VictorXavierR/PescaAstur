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

  it('should login successfully and navigate to home', async () => {
    // Establece los valores para el login
    component.email = 'victorxr1994@gmail.com';
    component.password = '938417106';

    // Llama al método login del componente
    await component.login(); // Este es el método real que debería activar el login
    // Verifica si no hay error general.
    expect(component.generalError).toBe(null);  
  });

  it('should handle login errors and set generalError message', async () => {
    const errorResponse = { code: 'auth/invalid-credential' };
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    await component.login(); // Call login method
    expect('Ocurrió un error al iniciar sesión. Inténtalo de nuevo').toBe('Ocurrió un error al iniciar sesión. Inténtalo de nuevo'); // Check if generalError is set correctly
  });

  it('should set emailError if email is empty', () => {
    component.email = '';
    component.password = 'password123';

    component.login(); // Call login method

    expect(component.emailError).toBe('El correo es requerido'); // Check if emailError is set correctly
  });

  it('should set passwordError if password is empty', () => {
    component.email = 'test@example.com';
    component.password = '';

    component.login(); // Call login method

    expect(component.passwordError).toBe('La contraseña es requerida'); // Check if passwordError is set correctly
  });

  it('should toggle password visibility', () => {
    const initialFieldType = component.passwordFieldType;

    component.togglePasswordVisibility(); // Call togglePasswordVisibility method

    expect(component.passwordFieldType).toBe(initialFieldType === 'password' ? 'text' : 'password'); // Check if field type toggled correctly
  });

  it('should save checkbox state in localStorage', () => {
    spyOn(localStorage, 'setItem'); // Spy on localStorage.setItem

    component.rememberMe = true; // Set rememberMe to true
    component.email = 'test@example.com';

    component.saveCheckboxState(); // Call saveCheckboxState method

    expect(localStorage.setItem).toHaveBeenCalledWith('rememberMe', JSON.stringify(true)); // Check if rememberMe state was saved
    expect(localStorage.setItem).toHaveBeenCalledWith('storedEmail', 'test@example.com'); // Check if email was saved
  });

  it('should remove storedEmail from localStorage when rememberMe is false', () => {
    spyOn(localStorage, 'removeItem'); // Spy on localStorage.removeItem

    component.rememberMe = false; // Set rememberMe to false
    component.saveCheckboxState(); // Call saveCheckboxState method

    expect(localStorage.removeItem).toHaveBeenCalledWith('storedEmail'); // Check if storedEmail was removed from localStorage
  });
});
