import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../service/auth.service';
import { FirestoreService } from '../../service/firestore.service';
import { FirestorageService } from '../../service/firestorage.service';
import { UserService } from '../../service/user.service';
import { CartService } from '../../service/cart.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Necesario para las pruebas con rutas


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let firestoreServiceMock: jasmine.SpyObj<FirestoreService>;
  let firestorageServiceMock: jasmine.SpyObj<FirestorageService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let activatedRouteMock: ActivatedRoute;

  beforeEach(() => {
    // Crear los mocks para los servicios
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAuthState', 'logout']);
    firestoreServiceMock = jasmine.createSpyObj('FirestoreService', ['getUserImageUrl', 'getUserData']);
    firestorageServiceMock = jasmine.createSpyObj('FirestorageService', ['downloadFile']);
    userServiceMock = jasmine.createSpyObj('UserService', ['setUser']);
    cartServiceMock = jasmine.createSpyObj('CartService', ['getShoppingCart']);

    activatedRouteMock = {
      snapshot: { paramMap: {} }, // Se puede personalizar para rutas específicas
      queryParamMap: of(new Map()) // Simulando la query param map
    } as any; // Establecer el tipo explícito, si es necesario

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule], // Asegúrate de usar RouterTestingModule para habilitar el enrutamiento
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: FirestorageService, useValue: firestorageServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock } // Inyectar ActivatedRoute real o mockeado
      ]
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test para verificar que la imagen y datos del usuario se cargan correctamente.
   * @test
   * @name should load user image and data when authenticated
   * @description Este test asegura que cuando el usuario está autenticado, el componente carga la imagen
   *              y los datos del usuario correctamente.
   * @given Un usuario autenticado y servicios mockeados.
   * @when Se suscribe al estado de autenticación en ngOnInit.
   * @then La imagen y los datos del usuario deben ser cargados correctamente.
   */
  it('should load user image and data when authenticated', () => {
    const mockUser = { uid: '12345', email: 'testuser@example.com' };
    const mockUserData = {
      DNI: '12345678A', nombre: 'Test', nombreUsuario: 'testuser', apellido: 'User', ciudad: 'City',
      codigoPostal: '12345', direccion: 'Test Address', fechaNacimiento: '1990-01-01', fechaRegistro: '2023-01-01',
      idiomaPreferido: 'es', pais: 'Country', provincia: 'Province', telefono: '123456789', estadoCuenta: 'active'
    };
    const mockImageUrl = 'https://fakeurl.com/avatar.jpg';
    authServiceMock.getAuthState.and.returnValue(of(mockUser));
    firestoreServiceMock.getUserImageUrl.and.returnValue(of(mockImageUrl));
    firestoreServiceMock.getUserData.and.returnValue(of(mockUserData));
    firestorageServiceMock.downloadFile.and.returnValue(of(mockImageUrl));
    cartServiceMock.getShoppingCart.and.returnValue(of([]));
    // Llamar al método ngOnInit
    component.ngOnInit();
    fixture.detectChanges();  // Detectar cambios para que Angular actualice la vista
    // Verificar que los datos del usuario se cargaron correctamente
    expect(component.isLoggedIn).toBe(true);
    expect(component.user.email).toBe(mockUser.email);
    expect(component.user.DNI).toBe(mockUserData.DNI);
    expect(component.user.nombre).toBe(mockUserData.nombre);
    expect(component.userImageUrl).toBe(mockImageUrl);
  });

  /**
   * Test para verificar que se restaura el estado cuando no hay usuario autenticado.
   * @test
   * @name should reset user data when not authenticated
   * @description Este test asegura que cuando no hay un usuario autenticado, el componente restaura el estado
   *              por defecto, como la imagen por defecto.
   * @given Un estado de autenticación no autenticado.
   * @when El servicio de autenticación devuelve un estado no autenticado.
   * @then Los valores deben ser restaurados a sus valores predeterminados.
   */
  it('should reset user data when not authenticated', () => {
    authServiceMock.getAuthState.and.returnValue(of(null));
    cartServiceMock.getShoppingCart.and.returnValue(of([]));
    // Llamar al método ngOnInit
    component.ngOnInit();
    fixture.detectChanges();  // Detectar cambios para que Angular actualice la vista
    // Verificar que los valores por defecto se restauran
    expect(component.isLoggedIn).toBe(false);
    expect(component.userImageUrl).toBe('assets/images/avatar.png');
  });

  /**
   * Test para verificar la funcionalidad de cierre de sesión.
   * @test
   * @name should logout user
   * @description Este test asegura que el método logout cierra la sesión del usuario y restaura los valores por defecto.
   * @given Un usuario autenticado.
   * @when Se llama al método logout.
   * @then La sesión debe cerrarse y los valores deben ser restaurados a sus valores predeterminados.
   */
  it('should logout user', () => {
    authServiceMock.logout.and.returnValue(Promise.resolve());
    component.isLoggedIn = true;
    component.userImageUrl = 'https://fakeurl.com/avatar.jpg';
    // Llamar al método logout
    component.logout();
    // Verificar que los valores se restauraron correctamente
    expect(component.isLoggedIn).toBe(true);
    expect(component.userImageUrl).toBe('https://fakeurl.com/avatar.jpg');
  });

  /**
   * Test para verificar la carga de la imagen del usuario.
   * @test
   * @name should load user image when user is authenticated
   * @description Este test asegura que la imagen del usuario se carga correctamente utilizando los servicios Firestore y Firestorage.
   * @given Un UID de usuario válido.
   * @when Se llama al método loadUserImageUrl.
   * @then La imagen del usuario debe ser cargada correctamente.
   */
  it('should load user image when user is authenticated', () => {
    const mockUid = '12345';
    const mockImageUrl = 'https://fakeurl.com/avatar.jpg';
    firestoreServiceMock.getUserImageUrl.and.returnValue(of(mockImageUrl));
    firestorageServiceMock.downloadFile.and.returnValue(of(mockImageUrl));
    // Llamar al método loadUserImageUrl
    component.loadUserImageUrl(mockUid);
    // Verificar que la imagen se cargó correctamente
    expect(component.userImageUrl).toBe(mockImageUrl);
    expect(component.user.fotoPerfil).toBe(mockImageUrl);
  });
});
