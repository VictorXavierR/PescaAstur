import { TestBed } from '@angular/core/testing';
import { User } from '../model/user';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]  // Inyectamos el servicio que estamos probando
    });

    service = TestBed.inject(UserService);  // Obtenemos la instancia del servicio
  });

  it('should be created', () => {
    expect(service).toBeTruthy();  // Verificar que el servicio se cree correctamente
  });

  /**
   * Test que verifica el comportamiento del método `setUser` y `getUser`.
   * Este test asegura que cuando se llama a `setUser` para asignar un usuario,
   * el método `getUser` devuelve ese usuario correctamente.
   * @test
   * @name should set and get user
   * @description Este test verifica que el método `setUser` asigne un usuario correctamente
   *              y que el método `getUser` devuelva el usuario asignado.
   * @given El servicio `UserService` y un usuario `User`.
   * @when Se llama al método `setUser` con el usuario.
   * @then Se debe recuperar correctamente el mismo usuario con el método `getUser`.
   * @example 
   * const mockUser = new User();
   * service.setUser(mockUser);
   * const user = service.getUser();
   * expect(user).toEqual(mockUser);
   */
  it('should set and get user', () => {
    // Crear un usuario simulado con datos de ejemplo
    const mockUser = new User();
    mockUser.DNI = '12345678A';
    mockUser.nombre = 'Juan';
    mockUser.nombreUsuario = 'juanito';
    mockUser.email = 'juanito@example.com';
    mockUser.apellido = 'Pérez';
    mockUser.fechaNacimiento = '1990-01-01';
    mockUser.telefono = '123456789';
    mockUser.pais = 'España';
    mockUser.provincia = 'Madrid';
    mockUser.ciudad = 'Madrid';
    mockUser.codigoPostal = '28001';
    mockUser.direccion = 'Calle Falsa 123';
    mockUser.estadoCuenta = 'Activo';
    mockUser.fechaRegistro = '2020-01-01';
    mockUser.idiomaPreferido = 'Español';
    mockUser.fotoPerfil = 'https://example.com/juanito.jpg';
    // Asignar el usuario al servicio
    service.setUser(mockUser);
    // Recuperar el usuario del servicio
    const user = service.getUser();
    // Verificar que el usuario recuperado es el mismo que se asignó
    expect(user).toEqual(mockUser);  // Comparar el objeto completo de usuario
  });

  /**
   * Test que verifica el comportamiento del método `getUser` cuando no se ha asignado un usuario.
   * Este test asegura que si no se ha asignado un usuario, el método `getUser` devuelve un nuevo usuario.
   * @test
   * @name should return a new user if not set
   * @description Este test verifica que si no se ha asignado un usuario, el método `getUser` 
   *              devuelve una nueva instancia de `User`.
   * @given El servicio `UserService` sin un usuario asignado.
   * @when Se llama al método `getUser` sin haber llamado a `setUser`.
   * @then Se debe devolver un nuevo usuario.
   * @example 
   * const user = service.getUser();
   * expect(user).toBeInstanceOf(User);
   */
  it('should return a new user if not set', () => {
    // Recuperar el usuario sin haberlo asignado previamente
    const user = service.getUser();
    // Verificar que el usuario devuelto es una nueva instancia de `User`
    expect(user).toBeInstanceOf(User);
    // Verificar que las propiedades de la instancia por defecto son las esperadas
    expect(user.DNI).toBe('');
    expect(user.nombre).toBe('');
    expect(user.nombreUsuario).toBe('');
    expect(user.email).toBe('');
    expect(user.apellido).toBe('');
    expect(user.fechaNacimiento).toBe('');
    expect(user.telefono).toBe('');
    expect(user.pais).toBe('');
    expect(user.provincia).toBe('');
    expect(user.ciudad).toBe('');
    expect(user.codigoPostal).toBe('');
    expect(user.direccion).toBe('');
    expect(user.estadoCuenta).toBe('');
    expect(user.fechaRegistro).toBe('');
    expect(user.idiomaPreferido).toBe('');
    expect(user.fotoPerfil).toBe('');
  });
});
