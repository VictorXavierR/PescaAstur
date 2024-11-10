import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserprofileComponent } from './userprofile.component';
import { UserService } from '../service/user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { User } from '../model/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mocks de los servicios
class MockUserService {
  getUser() {
    return new User();
  }
}

describe('UserprofileComponent', () => {
  let component: UserprofileComponent;
  let fixture: ComponentFixture<UserprofileComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let formBuilder: FormBuilder;
  let getUserSpy: jasmine.Spy;

  beforeEach(() => {
    // Crear un mock del servicio UserService con un espía para getUser
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser']);

    formBuilder = new FormBuilder();

    TestBed.configureTestingModule({
      declarations: [UserprofileComponent],
      imports: [ HttpClientTestingModule ,ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserprofileComponent);
    component = fixture.componentInstance;
    // Simula que getUser devuelve un objeto de usuario cuando se llama
    userServiceMock.getUser.and.returnValue({
      DNI: '12345678A',
      nombre: 'John Doe',
      nombreUsuario: 'johndoe',
      email: 'john.doe@example.com',
      apellido: 'Doe',
      fechaNacimiento: '1990-01-01',
      telefono: '123456789',
      pais: 'España',
      provincia: 'Madrid',
      ciudad: 'Madrid',
      codigoPostal: '28001',
      direccion: 'Calle Falsa 123',
      estadoCuenta: 'Activo',
      fechaRegistro: '2022-01-01',
      idiomaPreferido: 'Español',
      fotoPerfil: 'assets/images/avatar.png',
    });
    // Llamamos a ngOnInit para inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();  // Detectar cambios en la vista
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test para verificar que los datos del usuario se cargan correctamente en el componente.
   * @test
   * @name should load user data correctly
   * @description Este test asegura que, cuando el componente se inicializa, 
   *              los datos del usuario (como nombre, correo electrónico y foto de perfil) 
   *              se cargan correctamente desde el servicio.
   * @given Un usuario autenticado con datos predefinidos y el servicio de usuario mockeado.
   * @then Los datos del usuario deben ser cargados y mostrarse correctamente en el formulario.
   */
  it('should load user data correctly', () => {
    // Comprobamos directamente los datos cargados en el componente
    expect(component.user.nombre).toBe('John Doe');
    expect(component.user.email).toBe('john.doe@example.com');
    expect(component.user.fotoPerfil).toBe('assets/images/avatar.png');
    // Verificar los valores en el formulario
    expect(component.userForm.controls['nombre'].value).toBe('John Doe');
    expect(component.userForm.controls['email'].value).toBe('john.doe@example.com');
  });

  /**
   * Test para verificar que el formulario se habilita al presionar el botón de editar.
   * @test
   * @name should enable form when edit button is clicked
   * @description Este test asegura que al hacer clic en el botón de editar, 
   *              el formulario se habilite para que el usuario pueda modificar los datos.
   * @given El componente está en modo visualización, con el formulario deshabilitado.
   * @when El usuario hace clic en el botón "Editar".
   * @then El formulario debe habilitarse y la variable `perfilEditable` debe ser `true`.
   */
  it('should enable form when edit button is clicked', () => {
    // Arrange
    component.perfilEditable = false;
    // Act
    component.editable();
    // Assert
    expect(component.perfilEditable).toBeTrue();
    expect(component.userForm.enabled).toBeTrue();
  });

  /**
   * Test para verificar que el formulario se deshabilita y restablece a sus valores iniciales 
   * cuando se cancela la edición.
   * @test
   * @name should disable and reset form when cancel button is clicked
   * @description Este test asegura que al hacer clic en el botón "Cancelar", 
   *              el formulario se deshabilite y los valores sean restaurados a los valores originales.
   * @given El componente está en modo edición, con valores modificados en el formulario.
   * @when El usuario hace clic en el botón "Cancelar".
   * @then El formulario debe deshabilitarse y los valores deben ser restaurados a los iniciales.
   */
  it('should disable the form and submit data when onSubmit is called', async () => {
    // Arrange: Espía de fetch con respuesta simulada
    const mockResponse = new Response('Success', {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    });
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse));
  
    // Asegurarnos de que el formulario esté habilitado
    component.userForm.enable(); 
  
    // Asegúrate de que todos los campos del formulario tienen valores
    component.userForm.patchValue({
      userName: 'Victor',
      nombre: 'Victor',
      apellido: 'Xavier Rodríguez',
      email: 'victorxr1994@gmail.com',
      DNI: '47919438L',
      telefono: '123456789',
      pais: 'Esaña',
      provincia: 'Asturias',
      ciudad: 'Besullo',
      codigoPostal: '33815',
      direccion: 'Carretera Besullo, 49',
      estadoCuenta: 'activo',
      fechaRegistro: '01-01-2021',
      fechaNacimiento: '01-01-1990',
      idiomaPreferido: 'Español',
    });
  
    // Act: Llama a onSubmit y espera que se complete
    await component.onSubmit();
  
    // Assert: Verifica que fetch fue llamado con los argumentos esperados
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:8080/api/users/update-details',
      jasmine.objectContaining({
        method: 'POST',
        body: jasmine.any(FormData),
      })
    );
  });

  /**
   * Test para verificar que los datos del formulario se envían correctamente al servidor 
   * cuando se envía el formulario.
   * @test
   * @name should submit form data when form is valid
   * @description Este test asegura que cuando el formulario es válido, los datos del formulario 
   *              se envíen correctamente al servidor utilizando una solicitud POST.
   * @given El formulario contiene datos válidos y el servicio HTTP está configurado correctamente.
   * @when El usuario envía el formulario llamando a `onSubmit()`.
   * @then La solicitud POST debe ser enviada con los datos del formulario.
   */
  it('should submit form data when form is valid', async () => {
    // Arrange: Crear un objeto que simule la respuesta de fetch
    const response = new Response('Success', {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    });
  
    // Simular que fetch devuelve la respuesta con el método 'text'
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(response));

    // Asegurarnos de que el formulario esté habilitado
    component.userForm.enable(); 
  
    // Asegúrate de que todos los campos del formulario tienen valores
    component.userForm.patchValue({
      userName: 'Victor',
      nombre: 'Victor',
      apellido: 'Xavier Rodríguez',
      email: 'victorxr1994@gmail.com',
      DNI: '47919438L',
      telefono: '123456789',
      pais: 'Esaña',
      provincia: 'Asturias',
      ciudad: 'Besullo',
      codigoPostal: '33815',
      direccion: 'Carretera Besullo, 49',
      estadoCuenta: 'activo',
      fechaRegistro: '01-01-2021',
      fechaNacimiento: '01-01-1990',
      idiomaPreferido: 'Español',
    });
  
    // Forzar validación del formulario
  component.userForm.updateValueAndValidity();
  fixture.detectChanges();

  // Depuración: verifica el estado de cada control
  Object.keys(component.userForm.controls).forEach(controlName => {
    const control = component.userForm.get(controlName);
    console.log(`${controlName} - valid: ${control?.valid}, errors:`, control?.errors);
    expect(control?.valid).toBeTrue();
  });

  // Verificar que el formulario es válido
  expect(component.userForm.valid).toBeTrue();

  // Act: Llamar al método onSubmit
  await component.onSubmit();

  // Assert: Verificar que fetch fue llamado con los parámetros correctos
  expect(fetch).toHaveBeenCalledWith(
    'http://localhost:8080/api/users/update-details',
    jasmine.objectContaining({
      method: 'POST',
      body: jasmine.any(FormData),
    })
  );
  });  
  
  /**
   * Test para verificar que la imagen de perfil se actualiza correctamente 
   * cuando se selecciona un archivo.
   * @test
   * @name should update profile picture when a file is selected
   * @description Este test asegura que cuando un usuario selecciona un archivo para la imagen de perfil, 
   *              la propiedad `fotoPerfil` se actualiza con el archivo seleccionado y la imagen se muestra correctamente.
   * @given El componente está configurado con un archivo de imagen vacío.
   * @when El usuario selecciona un archivo a través de la interfaz.
   * @then La propiedad `fotoPerfil` debe actualizarse con el archivo seleccionado y la imagen debe representarse.
   */
  it('should update profile picture when a file is selected', () => {
    // Arrange
    const file = new File([''], 'profile.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };
    // Act
    component.onFileSelected(event);
    // Assert
    expect(component.fotoPerfil).toBe(file);
    expect(component.user.fotoPerfil).toContain('assets/images/avatar.png');
  });

  /**
   * Test para verificar que la fecha se formatea correctamente desde el timestamp de Firebase.
   * @test
   * @name should format date correctly from Firebase timestamp
   * @description Este test asegura que el método `formatearFecha` convierte correctamente un timestamp de Firebase 
   *              en una fecha con el formato 'dd-MM-yyyy'.
   * @given Un timestamp en segundos de Firebase.
   * @when Se llama al método `formatearFecha` con el timestamp.
   * @then La fecha debe ser formateada correctamente en el formato 'dd-MM-yyyy'.
   */
  it('should format date correctly from Firebase timestamp', () => {
    // Arrange
    const date = { seconds: 1617185412 }; // Un ejemplo de timestamp en segundos
    const expectedFormattedDate = '31-03-2021'; // Fecha esperada
    // Act
    const formattedDate = component.formatearFecha(date);
    // Assert
    expect(formattedDate).toBe(expectedFormattedDate);
  });
});
