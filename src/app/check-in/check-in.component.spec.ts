
import { RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckInComponent } from './check-in.component';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}


describe('CheckInComponent', () => {
  let component: CheckInComponent;
  let fixture: ComponentFixture<CheckInComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CheckInComponent],
      imports: [
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckInComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct structure', () => {
    expect(component.registerForm.contains('nombre')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('telefono')).toBeTrue();
    expect(component.registerForm.contains('direccion')).toBeTrue();
    expect(component.registerForm.contains('userName')).toBeTrue();
    // Verifica que todos los campos estén presentes en el formulario
  });

  it('should call register method when form is valid', () => {
    // Simula la validación del formulario con datos válidos
    component.registerForm.setValue({
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      telefono: '123456789',
      direccion: '123 Main St',
      userName: 'john_doe',
      fechaNacimiento: new Date('2000-01-01'),
      apellidos: 'Doe',
      ciudad: 'City',
      pais: 'Country',
      codigoPostal: '12345',
      password: 'password123',
      confirmPassword: 'password123',
      preferLanguage: 'ES',
      dni: '12345678A',
      provincia: 'Provincia'
    });

    // Es necesario hacer un spy sobre el método "fetch" ya que es el que realiza la petición HTTP
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: () => Promise.resolve({})  // Devuelve una promesa resuelta con un objeto vacío
      } as Response)
    );

    component.register();

    // Verifica si el método "fetch" fue llamado
    expect(fetchSpy).toHaveBeenCalled();
  });

  interface FileSelectEvent {
    target: {
      files: File[];
    };
  }


  it('should call onFileSelected method when a file is selected', () => {
    // Crear un evento simulado con un archivo
    const file = new File([''], 'test-image.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;

    // Crear un FileReader mock más completo
    const mockFileReader: Partial<FileReader> = {
      result: 'data:image/png;base64,mockBase64Data',
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onload: null,
      onerror: null,
      onabort: null,
      onloadstart: null,
      onloadend: null,
      onprogress: null,
      error: null,
      DONE: FileReader.DONE,
      EMPTY: FileReader.EMPTY,
      LOADING: FileReader.LOADING,
      readyState: FileReader.EMPTY
    };

    // Espiar la creación de FileReader y devolver nuestro mock
    spyOn(window, 'FileReader').and.returnValue(mockFileReader as FileReader);

    // Espiar el método `readAsDataURL` de `FileReader` y simular la llamada de `onload`
    (mockFileReader.readAsDataURL as jasmine.Spy).and.callFake(function (this: FileReader) {
      if (typeof this.onload === 'function') {
        const mockProgressEvent = new ProgressEvent('load', {
          lengthComputable: true,
          loaded: 100,
          total: 100
        }) as ProgressEvent<FileReader>;

        // Asignar manualmente el target al evento
        Object.defineProperty(mockProgressEvent, 'target', {
          value: this,
          enumerable: true
        });

        this.onload(mockProgressEvent);
      }
    });

    // Llamar al método onFileSelected con el evento simulado
    component.onFileSelected(event);

    // Verificar que `readAsDataURL` haya sido llamado
    expect(mockFileReader.readAsDataURL).toHaveBeenCalled();
  });

  it('should load the default image when component is initialized', async () => {
    // Crear un Blob mock
    const mockBlob = new Blob([''], { type: 'image/png' });

    // Mock de la función fetch con una respuesta más completa
    const fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({
      blob: () => Promise.resolve(mockBlob),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: 'assets/images/avatar.png',
      clone: () => ({} as Response),
      body: null,
      bodyUsed: false
    } as Response));

    await component.loadDefaultImage();

    expect(fetchSpy).toHaveBeenCalledWith('assets/images/avatar.png');
    expect(component.profilePicture).toBeInstanceOf(File);
  });
  it('should validate the DNI correctly', () => {
    const validDni = '12345678A';
    const invalidDni = '12345A';

    const validControl = new FormControl(validDni);
    const invalidControl = new FormControl(invalidDni);

    expect(component.validarDNI()(validControl as AbstractControl)).toBeNull();  // Debería ser válido
    expect(component.validarDNI()(invalidControl as AbstractControl)).toEqual({ dniInvalido: true });  // Debería ser inválido
  });
});

