import { TestBed } from '@angular/core/testing';
import { FirestoreService } from './firestore.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirestorageService } from './firestorage.service';
import { of } from 'rxjs';


describe('FirestoreService', () => {
  let service: FirestoreService;
  let firestoreMock: jasmine.SpyObj<AngularFirestore>;
  let firestorageMock: jasmine.SpyObj<FirestorageService>;

  beforeEach(() => {
    // Crear mocks de AngularFirestore y FirestorageService
    firestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection']);
    firestorageMock = jasmine.createSpyObj('FirestorageService', ['downloadFile']);

    TestBed.configureTestingModule({
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: FirestorageService, useValue: firestorageMock }
      ]
    });

    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  /**
   * Test que verifica el funcionamiento del método `getUserImageUrl` del servicio `FirestoreService`.
   * Este test asegura que el método `getUserImageUrl` invoque correctamente el método `valueChanges` 
   * de `AngularFirestore` y devuelva la URL de la imagen de perfil del usuario.
   *
   * @test
   * @name should return user image URL
   * @description Este test asegura que el método `getUserImageUrl` en el servicio `FirestoreService`
   *              invoque el método `valueChanges` de `AngularFirestore` correctamente y devuelva 
   *              la URL de la foto de perfil del usuario.
   * 
   * @given El servicio `FirestoreService` y un UID de usuario.
   * 
   * @when Se llama al método `getUserImageUrl` con el UID proporcionado.
   * 
   * @then El método `getUserImageUrl` debería devolver un observable con la URL de la foto de perfil del usuario.
   *
   * @example 
   * service.getUserImageUrl('uid123').subscribe((url) => {
   *   expect(url).toBe('https://example.com/image.jpg');
   * });
   */
  it('should return user image URL', (done) => {
    const testUid = 'uid123';
    const expectedImageUrl = 'https://example.com/image.jpg';
    const mockUserData = { fotoPerfil: expectedImageUrl };

    // Mock de la colección 'users' con un documento que devuelve un observable
    const mockCollection = jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
    const mockDoc = jasmine.createSpyObj('AngularFirestoreDocument', ['valueChanges']);
    
    // El mock valueChanges devuelve un observable con los datos simulados
    mockDoc.valueChanges.and.returnValue(of(mockUserData));
    
    // El mock de la colección devuelve el mock de documento cuando se llama a doc()
    mockCollection.doc.and.returnValue(mockDoc);
    
    // Configuramos el mock de collection() para que devuelva nuestro mock de colección
    firestoreMock.collection.and.returnValue(mockCollection);

    // Llamar al método getUserImageUrl
    service.getUserImageUrl(testUid).subscribe((url) => {
      // Verificar que se haya llamado a la colección 'users'
      expect(firestoreMock.collection).toHaveBeenCalledWith('users' as any); // Forzar el tipo 'any' para evitar error de tipo

      // Verificar que se haya llamado con el UID del documento correcto
      expect(mockCollection.doc).toHaveBeenCalledWith(testUid); 

      // Verificar que la URL recibida es la correcta
      expect(url).toBe(expectedImageUrl); 

      done();
    });
  });
  /**
   * Test que verifica el funcionamiento del método `getUserData` del servicio `FirestoreService`.
   * Este test asegura que el método `getUserData` invoque correctamente el método `valueChanges` 
   * de `AngularFirestore` y devuelva los datos completos del usuario.
   * @test
   * @name should return user data
   * @description Este test asegura que el método `getUserData` en el servicio `FirestoreService`
   *              invoque el método `valueChanges` de `AngularFirestore` correctamente y devuelva 
   *              los datos completos del usuario.
   * @given El servicio `FirestoreService` y un UID de usuario.
   * @when Se llama al método `getUserData` con el UID proporcionado.
   * @then El método `getUserData` debería devolver un observable con los datos del usuario.
   * @example 
   * service.getUserData('uid123').subscribe((data) => {
   *   expect(data).toEqual(mockUserData);
   * });
   */
  it('should return user data', (done) => {
    const testUid = 'uid123';
    const mockUserData = { nombre: 'John Doe', fotoPerfil: 'https://example.com/image.jpg' };

    // Crear un mock del documento que devuelve un observable
    const mockDoc = jasmine.createSpyObj('AngularFirestoreDocument', ['valueChanges']);
    mockDoc.valueChanges.and.returnValue(of(mockUserData));

    // Crear un mock de la colección que devuelve el documento mockeado
    const mockCollection = jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
    mockCollection.doc.and.returnValue(mockDoc);

    // Configuramos el mock de collection() para que devuelva nuestro mock de colección
    firestoreMock.collection.and.returnValue(mockCollection);

    // Llamar al método getUserData
    service.getUserData(testUid).subscribe((data) => {
      // Verificar que se haya llamado a la colección 'users' con el nombre correcto
      expect(firestoreMock.collection).toHaveBeenCalledWith('users' as any);

      // Verificar que se haya llamado con el UID del documento correcto
      expect(mockCollection.doc).toHaveBeenCalledWith(testUid);

      // Verificar que los datos recibidos son los correctos
      expect(data).toEqual(mockUserData);

      done();
    });
  });
});
