import { TestBed } from '@angular/core/testing';
import { FirestorageService } from './firestorage.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of } from 'rxjs';

describe('FirestorageService', () => {
  let service: FirestorageService;
  let fireStorageMock: jasmine.SpyObj<AngularFireStorage>;

  beforeEach(() => {
    // Crear un mock de AngularFireStorage
    fireStorageMock = jasmine.createSpyObj('AngularFireStorage', ['ref']);

    TestBed.configureTestingModule({
      providers: [
        FirestorageService,
        { provide: AngularFireStorage, useValue: fireStorageMock }
      ]
    });
    service = TestBed.inject(FirestorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test que verifica el funcionamiento del método `downloadFile` del servicio `FirestorageService`.
   * Este test asegura que el método `downloadFile` invoque correctamente el método `getDownloadURL` 
   * de `AngularFireStorage` y devuelva la URL de descarga esperada.
   *
   * @test
   * @name should return download URL
   * @description Este test asegura que el método `downloadFile` en el servicio `FirestorageService`
   *              invoque el método `getDownloadURL` de `AngularFireStorage` correctamente y 
   *              devuelva una URL.
   * 
   * @given El servicio `FirestorageService` con un mock de `AngularFireStorage`.
   * 
   * @when Se llama al método `downloadFile` con una ruta de archivo.
   * 
   * @then El método `getDownloadURL` debe ser llamado y el resultado debe ser un observable 
   *         con la URL de descarga esperada.
   *
   * @example 
   * service.downloadFile('path/to/file');
   * expect(fireStorageMock.ref).toHaveBeenCalledWith('path/to/file');
   * expect(result).toBe('https://download.url');
   */
  it('should return download URL', (done) => {
    const testPath = 'path/to/file';
    const expectedUrl = 'https://download.url';

    // Configurar el mock para que `ref` devuelva un objeto con `getDownloadURL` que retorna el `expectedUrl`
    const storageRefMock = jasmine.createSpyObj('StorageReference', ['getDownloadURL']);
    storageRefMock.getDownloadURL.and.returnValue(of(expectedUrl));
    fireStorageMock.ref.and.returnValue(storageRefMock);

    // Llamar al método `downloadFile`
    service.downloadFile(testPath).subscribe((url) => {
      expect(fireStorageMock.ref).toHaveBeenCalledWith(testPath); // Verifica que `ref` fue llamado con la ruta correcta
      expect(url).toBe(expectedUrl); // Verifica que la URL devuelta es la esperada
      done();
    });
  });

});
