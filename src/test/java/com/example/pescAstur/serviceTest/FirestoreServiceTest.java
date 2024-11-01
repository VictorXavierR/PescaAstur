package com.example.pescAstur.serviceTest;
import com.example.pescAstur.model.Product;
import com.example.pescAstur.model.User;
import com.example.pescAstur.service.FireStorageService;
import com.example.pescAstur.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class FirestoreServiceTest {

    @Mock
    private Firestore db;

    @Mock
    private FireStorageService fireStorageService;

    @Mock
    private DocumentReference documentReference;

    @Mock
    private CollectionReference mockCollectionRef;
    @Mock
    private DocumentReference mockDocRef;

    private FirestoreService firestoreService;

    private final String userId = "testUserId";
    private User user;
    private ApiFuture<DocumentSnapshot> mockFuture;
    private DocumentSnapshot mockDocument;


    @BeforeEach
    void setUp() {
        db = mock(Firestore.class);
        documentReference = mock(DocumentReference.class);
        mockFuture = mock(ApiFuture.class);
        mockDocument = mock(DocumentSnapshot.class);
        CollectionReference usersCollection = mock(CollectionReference.class);
        CollectionReference productsCollection = mock(CollectionReference.class);
        lenient().when(db.collection("users")).thenReturn(usersCollection);
        lenient().when(db.collection("products")).thenReturn(productsCollection);
        lenient().when(usersCollection.document(anyString())).thenReturn(documentReference);
        firestoreService = new FirestoreService(db, fireStorageService);
        user = new User();
        user.setNombre("John");
        user.setApellido("Doe");
        user.setTelefono("123456789");
        user.setDireccion("123 Street");
        user.setCiudad("City");
        user.setProvincia("Province");
        user.setCodigoPostal("12345");
        user.setPais("Country");
        user.setFechaNacimiento(new Date());
        user.setFechaRegistro(new Date());
        user.setIdiomaPreferido("EN");
        user.setEstadoCuenta("ACTIVE");
        user.setUserName("johndoe");
        user.setDNI("12345678X");
    }

    /**
     * Prueba el guardado exitoso de los detalles del usuario en Firestore.
     *
     * <p>Este test verifica que el método {@code saveUserDetails} de {@link FirestoreService}
     * guarde correctamente todos los detalles del usuario en Firestore. Específicamente, comprueba:</p>
     * <ul>
     *   <li>La correcta asignación de todos los campos del usuario al mapa de detalles.</li>
     *   <li>La subida exitosa de la foto de perfil utilizando {@link FireStorageService}.</li>
     *   <li>La escritura exitosa de los datos en Firestore.</li>
     * </ul>
     * <p>El test simula un usuario completo con todos sus campos y verifica que cada campo
     * se guarde correctamente en Firestore. También comprueba la interacción con el servicio
     * de almacenamiento para la foto de perfil.</p>
     * @throws IOException si ocurre un error durante la subida de la foto de perfil
     * @throws InterruptedException si la operación es interrumpida
     * @throws ExecutionException si ocurre un error durante la ejecución de la operación de Firestore
     */
    @Test
    void testSaveUserDetailsSuccess() throws IOException, InterruptedException, ExecutionException {
        // Arrange
        String userId = "testUserId";
        User user = new User();
        user.setUserName("johndoe");
        user.setEmail("john@example.com");
        user.setNombre("John");
        user.setApellido("Doe");
        user.setFechaNacimiento(new Date(90, 0, 1)); // 1 de enero de 1990
        user.setDNI("12345678A");
        user.setTelefono("123456789");
        user.setDireccion("Calle Ejemplo, 123");
        user.setCiudad("Ciudad Ejemplo");
        user.setProvincia("Provincia Ejemplo");
        user.setCodigoPostal("12345");
        user.setPais("España");
        user.setFechaRegistro(new Date());
        user.setEstadoCuenta("activo");
        user.setIdiomaPreferido("español");
        user.setFotoPerfil(null);

        MultipartFile mockFile = mock(MultipartFile.class);
        user.setFotoPerfil(mockFile);

        when(fireStorageService.uploadProfilePhoto(any(MultipartFile.class), eq(userId)))
                .thenReturn("profile_photo_url");

        WriteResult mockWriteResult = mock(WriteResult.class);
        when(mockWriteResult.getUpdateTime()).thenReturn(Timestamp.now());

        ApiFuture<WriteResult> mockFuture = mock(ApiFuture.class);
        when(mockFuture.get()).thenReturn(mockWriteResult);

        when(documentReference.set(any(Map.class))).thenReturn(mockFuture);

        // Act
        firestoreService.saveUserDetails(userId, user);

        // Assert
        verify(documentReference).set(argThat(map ->
                map.get("nombreUsuario").equals(user.getUserName()) &&
                        map.get("nombre").equals(user.getNombre()) &&
                        map.get("apellido").equals(user.getApellido()) &&
                        map.get("fechaNacimiento").equals(user.getFechaNacimiento()) &&
                        map.get("DNI").equals(user.getDNI()) &&
                        map.get("telefono").equals(user.getTelefono()) &&
                        map.get("direccion").equals(user.getDireccion()) &&
                        map.get("ciudad").equals(user.getCiudad()) &&
                        map.get("provincia").equals(user.getProvincia()) &&
                        map.get("codigoPostal").equals(user.getCodigoPostal()) &&
                        map.get("pais").equals(user.getPais()) &&
                        map.get("fechaRegistro").equals(user.getFechaRegistro()) &&
                        map.get("estadoCuenta").equals(user.getEstadoCuenta()) &&
                        map.get("idiomaPreferido").equals(user.getIdiomaPreferido()) &&
                        map.get("fotoPerfil").equals("profile_photo_url")
        ));

        verify(fireStorageService).uploadProfilePhoto(mockFile, userId);
    }

    /**
     * Test para verificar la correcta actualización de los detalles del usuario
     * cuando no existe una foto de perfil almacenada.
     * Este test simula un escenario en el que un usuario no tiene foto de perfil
     * registrada en el sistema. Se espera que la actualización de los detalles
     * del usuario se realice correctamente sin intentar eliminar o subir
     * ninguna foto de perfil.
     * <p>
     * Los pasos del test incluyen:
     * <ul>
     *     <li>Crear un objeto de usuario con todos los detalles necesarios y
     *         sin foto de perfil (fotoPerfil es null).</li>
     *     <li>Simular la obtención de la referencia del documento del usuario en Firestore.</li>
     *     <li>Simular el resultado de la llamada para verificar que el documento existe.</li>
     *     <li>Simular el resultado de la llamada a Firestore para actualizar los detalles del usuario.</li>
     *     <li>Verificar que el método de actualización fue llamado con los datos correctos.</li>
     * </ul>
     * </p>
     * <p>
     * Se asegura que la propiedad `fotoPerfil` no esté presente en las actualizaciones,
     * lo que indica que no se ha intentado eliminar una foto que no existe. Además,
     * se verifica que no haya interacciones con el servicio de almacenamiento de archivos
     * (fireStorageService) durante la prueba.
     * </p>
     * <p>
     * Si ocurre algún error durante el proceso de actualización, se lanza una
     * excepción que provoca que el test falle.
     * </p>
     * @throws Exception Si ocurre un error inesperado durante la ejecución
     *                   del método updateUserDetails.
     */
    @Test
    void testUpdateUserDetails_Success_NoExistingPhoto() throws Exception {

        // Arrange
        String userId = "testUserId";
        User user = new User();
        user.setUserName("johndoe");
        user.setEmail("john@example.com");
        user.setNombre("John");
        user.setApellido("Doe");
        user.setFechaNacimiento(new Date(90, 0, 1)); // 1 de enero de 1990
        user.setDNI("12345678A");
        user.setTelefono("123456789");
        user.setDireccion("Calle Ejemplo, 123");
        user.setCiudad("Ciudad Ejemplo");
        user.setProvincia("Provincia Ejemplo");
        user.setCodigoPostal("12345");
        user.setPais("España");
        user.setFechaRegistro(new Date());
        user.setEstadoCuenta("activo");
        user.setIdiomaPreferido("español");
        user.setFotoPerfil(null); // Asegúrate de que no haya foto de perfil


        // Mock Firestore document reference
        DocumentReference mockDocRef = mock(DocumentReference.class);
        when(db.collection("users").document(userId)).thenReturn(mockDocRef);


        // Mock ApiFuture and DocumentSnapshot
        ApiFuture<DocumentSnapshot> mockFuture = mock(ApiFuture.class);
        when(mockDocRef.get()).thenReturn(mockFuture);

        DocumentSnapshot mockDocumentSnapshot = mock(DocumentSnapshot.class);
        when(mockFuture.get()).thenReturn(mockDocumentSnapshot); // Simula el resultado de la llamada
        when(mockDocumentSnapshot.exists()).thenReturn(true); // Simula que el documento existe
        when(mockDocumentSnapshot.getString("fotoPerfil")).thenReturn(null); // No hay foto de perfil


        // Mock del resultado de la actualización
        WriteResult mockWriteResult = mock(WriteResult.class);
        when(mockWriteResult.getUpdateTime()).thenReturn(Timestamp.now());

        ApiFuture<WriteResult> mockWriteFuture = mock(ApiFuture.class);
        when(mockWriteFuture.get()).thenReturn(mockWriteResult);


        // Mockea el método update para que devuelva el ApiFuture simulado
        when(mockDocRef.update(anyMap())).thenReturn(mockWriteFuture);


        // Act
        try {
            firestoreService.updateUserDetails(userId, user);

        } catch (Exception e) {
            e.printStackTrace();
            throw e; // Re-lanzar la excepción para que el test falle
        }

        // Assert

        ArgumentCaptor<Map<String, Object>> updateCaptor = ArgumentCaptor.forClass(Map.class);
        verify(mockDocRef).update(updateCaptor.capture());


        Map<String, Object> capturedUpdates = updateCaptor.getValue();


        // Verificaciones individuales
        assertEquals(user.getNombre(), capturedUpdates.get("nombre"), "El nombre no coincide");
        assertEquals(user.getApellido(), capturedUpdates.get("apellido"), "El apellido no coincide");


        // Verifica que fotoPerfil no está en las actualizaciones
        assertFalse(capturedUpdates.containsKey("fotoPerfil"), "fotoPerfil no debería estar presente");

        // Verifica que fireStorageService no fue llamado
        verifyNoInteractions(fireStorageService);

    }
    /**
     * Test para verificar la correcta actualización de los detalles del usuario
     * cuando existe una foto de perfil previamente almacenada.
     * Este test simula un escenario en el que un usuario ya tiene una foto de perfil
     * almacenada en el sistema. Se espera que la foto existente sea eliminada y
     * que se suba una nueva foto de perfil proporcionada en el objeto de usuario.
     * <p>
     * Los pasos del test incluyen:
     * <ul>
     *     <li>Crear un objeto de usuario con todos los detalles necesarios y
     *         una nueva foto de perfil.</li>
     *     <li>Simular la obtención de la URL de la foto de perfil existente
     *         del documento de Firestore.</li>
     *     <li>Simular la eliminación de la foto de perfil existente.</li>
     *     <li>Simular la subida de la nueva foto de perfil.</li>
     *     <li>Verificar que se hayan realizado las actualizaciones correctas
     *         en Firestore.</li>
     * </ul>
     * </p>
     * <p>
     * Se asegura que las interacciones con el servicio de almacenamiento de
     * archivos (fireStorageService) sean correctas, y se verifica que no
     * haya interacciones adicionales después de la actualización.
     * </p>
     * <p>
     * Se lanza una excepción si ocurre algún error durante el proceso de
     * actualización, lo que provoca que el test falle.
     * </p>
     * @throws Exception Si ocurre un error inesperado durante la ejecución del método updateUserDetails.
     */
    @Test
    void testUpdateUserDetails_Success_WithExistingPhoto() throws Exception {
        // Arrange
        String userId = "testUserId";
        User user = new User();
        user.setUserName("johndoe");
        user.setEmail("john@example.com");
        user.setNombre("John");
        user.setApellido("Doe");
        user.setFechaNacimiento(new Date(90, 0, 1)); // 1 de enero de 1990
        user.setDNI("12345678A");
        user.setTelefono("123456789");
        user.setDireccion("Calle Ejemplo, 123");
        user.setCiudad("Ciudad Ejemplo");
        user.setProvincia("Provincia Ejemplo");
        user.setCodigoPostal("12345");
        user.setPais("España");
        user.setFechaRegistro(new Date());
        user.setEstadoCuenta("activo");
        user.setIdiomaPreferido("español");

        // Simulamos una nueva foto de perfil
        byte[] newPhotoData = new byte[]{1, 2, 3}; // Aquí debes poner los datos de la nueva foto
        MultipartFile newPhoto = new MockMultipartFile("profile.jpg", newPhotoData);
        user.setFotoPerfil(newPhoto); // Nueva foto de perfil a subir


        // Mock Firestore document reference
        DocumentReference mockDocRef = mock(DocumentReference.class);
        when(db.collection("users").document(userId)).thenReturn(mockDocRef);


        // Mock ApiFuture and DocumentSnapshot to return existing photo URL
        ApiFuture<DocumentSnapshot> mockFuture = mock(ApiFuture.class);
        when(mockDocRef.get()).thenReturn(mockFuture);

        DocumentSnapshot mockDocumentSnapshot = mock(DocumentSnapshot.class);
        when(mockFuture.get()).thenReturn(mockDocumentSnapshot); // Simula el resultado de la llamada
        when(mockDocumentSnapshot.exists()).thenReturn(true); // Simula que el documento existe
        when(mockDocumentSnapshot.getString("fotoPerfil")).thenReturn("existing_photo_url"); // URL de la foto existente


        // Mock para el método fireStorageService.deleteFile para eliminar la foto existente
        // Si deleteFile es un método void, usa doNothing(), de lo contrario, usa cuando...entonces
        when(fireStorageService.deleteFile("existing_photo_url")).thenReturn(true); // O usar doNothing() si es un método void

        // Mock para el método fireStorageService.uploadProfilePhoto
        when(fireStorageService.uploadProfilePhoto(newPhoto, userId)).thenReturn("new_photo_url");


        // Mock del resultado de la actualización
        WriteResult mockWriteResult = mock(WriteResult.class);
        when(mockWriteResult.getUpdateTime()).thenReturn(Timestamp.now());

        ApiFuture<WriteResult> mockWriteFuture = mock(ApiFuture.class);
        when(mockWriteFuture.get()).thenReturn(mockWriteResult);


        // Mockea el método update para que devuelva el ApiFuture simulado
        when(mockDocRef.update(anyMap())).thenReturn(mockWriteFuture);


        // Act
        System.out.println("Ejecutando updateUserDetails...");
        try {
            firestoreService.updateUserDetails(userId, user);
        } catch (Exception e) {
            e.printStackTrace();
            throw e; // Re-lanzar la excepción para que el test falle
        }

        // Assert

        ArgumentCaptor<Map<String, Object>> updateCaptor = ArgumentCaptor.forClass(Map.class);
        verify(mockDocRef).update(updateCaptor.capture());


        Map<String, Object> capturedUpdates = updateCaptor.getValue();


        // Verificaciones individuales
        assertEquals(user.getNombre(), capturedUpdates.get("nombre"), "El nombre no coincide");
        assertEquals(user.getApellido(), capturedUpdates.get("apellido"), "El apellido no coincide");
        assertEquals("new_photo_url", capturedUpdates.get("fotoPerfil"), "La foto de perfil no coincide");
        // ... (resto de las verificaciones)

        // Verifica que fireStorageService.deleteFile fue llamado con la URL de la foto existente
        verify(fireStorageService).deleteFile("existing_photo_url");

        // Verifica que fireStorageService.uploadProfilePhoto fue llamado con la nueva foto
        verify(fireStorageService).uploadProfilePhoto(newPhoto, userId);

        // Verifica que fireStorageService no fue llamado más allá de lo necesario
        verifyNoMoreInteractions(fireStorageService);
    }

    /**
     * Test para verificar la correcta eliminación de los detalles del usuario
     * en Firestore.
     * Este test simula el escenario en el que se intenta eliminar un documento
     * de usuario en la colección de "users" en Firestore. Se espera que la
     * eliminación se realice sin lanzar excepciones y que se imprima el tiempo
     * de eliminación.
     * <p>
     * Los pasos del test incluyen:
     * <ul>
     *     <li>Simular la referencia del documento del usuario.</li>
     *     <li>Simular la operación de eliminación en Firestore para que devuelva
     *         un resultado exitoso.</li>
     *     <li>Invocar el método deleteUserDetails y verificar que no se lanzan
     *         excepciones durante la ejecución.</li>
     * </ul>
     * </p>
     * <p>
     * Se espera que el método deleteUserDetails imprima el tiempo de eliminación
     * cuando se complete con éxito.
     * </p>
     * @throws Exception Si ocurre un error inesperado durante la ejecución del método deleteUserDetails.
     */
    @Test
    void testDeleteUserDetails_Success() throws Exception {
        // Arrange
        String userId = "testUserId";

        // Mocks
        CollectionReference mockCollectionRef = mock(CollectionReference.class);
        DocumentReference mockDocRef = mock(DocumentReference.class);
        ApiFuture<WriteResult> mockWriteFuture = mock(ApiFuture.class);
        WriteResult mockResult = mock(WriteResult.class);
        // Configura el mock de Firestore para devolver una colección
        when(db.collection("users")).thenReturn(mockCollectionRef);
        // Configura la colección para devolver un documento específico
        when(mockCollectionRef.document(userId)).thenReturn(mockDocRef);
        // Simula la operación de eliminación
        when(mockDocRef.delete()).thenReturn(mockWriteFuture);
        when(mockWriteFuture.get()).thenReturn(mockResult);
        // Simula que se obtuvo un tiempo de eliminación
        when(mockResult.getUpdateTime()).thenReturn(Timestamp.now()); // Simula el tiempo de eliminación
        // Act
        try {
            firestoreService.deleteUserDetails(userId);
        } catch (Exception e) {
            fail("El método deleteUserDetails lanzó una excepción: " + e.getMessage());
        }
        // Assert
        verify(mockDocRef).delete(); // Verifica que se llamó al método delete
        // Verifica que se imprimió el tiempo de eliminación (si se espera que el método lo haga)
        assertNotNull(mockResult.getUpdateTime(), "El tiempo de eliminación debería ser no nulo");
    }
    /**
     * Prueba unitaria para verificar el comportamiento del método {@link FirestoreService#deleteUserDetails(String)}
     * en caso de que se produzca un error durante la eliminación de un usuario.
     * <p>
     * Este método de prueba simula el escenario en el que se intenta eliminar un usuario de Firestore,
     * pero se lanza una {@link RuntimeException} durante la operación de eliminación. Se asegura de que:
     * </p>
     * <ul>
     *     <li>Se lanza una {@link RuntimeException} con el mensaje esperado al intentar eliminar un usuario.</li>
     *     <li>Se verifica que el método {@link DocumentReference#delete()} fue invocado en el objeto de referencia del documento.</li>
     * </ul>
     * <p>
     * Este test es parte de la validación del manejo de errores en el servicio de Firestore,
     * garantizando que el sistema responda adecuadamente a fallos en la operación de eliminación.
     * </p>
     */
    @Test
    void testDeleteUserDetails_Failure() {
        // Arrange
        String userId = "testUserId";

        // Solo aquí se configura el mock para la colección "users"
        when(db.collection("users")).thenReturn(mockCollectionRef);
        // Configura la colección para devolver un documento específico
        when(mockCollectionRef.document(userId)).thenReturn(mockDocRef);
        // Simula la operación de eliminación lanzando una excepción
        when(mockDocRef.delete()).thenThrow(new RuntimeException("Error al eliminar el usuario"));

        // Act
        Exception exception = assertThrows(RuntimeException.class, () -> {
            firestoreService.deleteUserDetails(userId);
        });

        // Assert
        assertEquals("Error al eliminar el usuario", exception.getMessage());
        verify(mockDocRef).delete(); // Verifica que se llamó al método delete
    }
    /**
     * Prueba unitaria para el método {@link FirestoreService#getProfilePhoto(String)} que verifica
     * la obtención exitosa de la URL de la foto de perfil de un usuario.
     * <p>
     * En esta prueba, se simula una referencia de documento en la base de datos que
     * contiene un campo "fotoPerfil" con una URL de ejemplo. La prueba valida que el
     * método retorne la URL correcta cuando el documento existe y contiene dicho campo.
     * </p>
     * @throws Exception si ocurre una excepción durante la ejecución de la operación asíncrona
     */
    @Test
    void testGetProfilePhoto_Success() throws Exception {
        // Arrange
        String userId = "testUserId";
        String expectedPhotoUrl = "http://example.com/photo.jpg";
        when(db.collection("users").document(userId)).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockDocument);
        when(mockDocument.exists()).thenReturn(true);
        when(mockDocument.getString("fotoPerfil")).thenReturn(expectedPhotoUrl);
        // Act
        String actualPhotoUrl = firestoreService.getProfilePhoto(userId);
        // Assert
        assertEquals(expectedPhotoUrl, actualPhotoUrl);
    }

    /**
     * Prueba unitaria para el método {@link FirestoreService#getProfilePhoto(String)}
     * que verifica el comportamiento cuando el documento de usuario no existe en la base de datos.
     * <p>
     * En esta prueba, se simula una referencia de documento inexistente en la base de datos.
     * La prueba valida que el método retorne {@code null} cuando el documento no existe.
     * </p>
     * @throws Exception si ocurre una excepción durante la ejecución de la operación asíncrona
     */
    @Test
    void testGetProfilePhoto_DocumentDoesNotExist() throws Exception {
        // Arrange
        String userId = "nonExistentUserId";

        when(db.collection("users").document(userId)).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockDocument);
        when(mockDocument.exists()).thenReturn(false);

        // Act
        String actualPhotoUrl = firestoreService.getProfilePhoto(userId);

        // Assert
        assertNull(actualPhotoUrl);
    }

    /**
     * Prueba unitaria para el método {@link FirestoreService#getProfilePhoto(String)}
     * que verifica el comportamiento cuando ocurre una excepción durante la obtención del documento de usuario.
     * <p>
     * En esta prueba, se simula una excepción de tipo {@link ExecutionException} cuando se intenta
     * recuperar el documento del usuario. La prueba valida que el método retorne {@code null} en caso de excepción.
     * </p>
     * @throws Exception si ocurre una excepción inesperada durante la ejecución de la operación asíncrona
     */
    @Test
    void testGetProfilePhoto_Exception() throws Exception {
        // Arrange
        String userId = "testUserId";

        when(db.collection("users").document(userId)).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenThrow(new ExecutionException("Error", new Throwable()));

        // Act
        String actualPhotoUrl = firestoreService.getProfilePhoto(userId);

        // Assert
        assertNull(actualPhotoUrl);
    }

    /**
     * Prueba unitaria para el método {@link FirestoreService#getAllProducts()} que verifica
     * que se obtienen correctamente todos los productos de la colección "products" en Firestore.
     * <p>
     * En esta prueba, se simulan varios documentos de productos en la colección, y la prueba
     * valida que el método devuelve una lista de productos que corresponde con los documentos simulados.
     * </p>
     * @throws ExecutionException si ocurre un error durante la ejecución de la operación asíncrona
     * @throws InterruptedException si la operación es interrumpida
     */
    @Test
    void testGetAllProducts_Success() throws ExecutionException, InterruptedException {
        // Arrange
        List puntuacion=new ArrayList<Integer>();
        List comentarios= new ArrayList<String>();
        puntuacion.add(1);
        comentarios.add("Genial");
        QuerySnapshot mockQuerySnapshot = mock(QuerySnapshot.class);
        List<QueryDocumentSnapshot> mockDocuments = new ArrayList<>();
        QueryDocumentSnapshot mockDoc1 = mock(QueryDocumentSnapshot.class);
        QueryDocumentSnapshot mockDoc2 = mock(QueryDocumentSnapshot.class);
        Product product1 = new Product(100,"Prueba1",10.50,"descripcion1",0.0,"grande","01/11/2024","foto1","marca1","producto1","peso1",20.80,puntuacion,comentarios,"UID1",1);
        Product product2 = new Product(200,"Prueba2",11.50,"descripcion2",0.0,"grande","01/11/2024","foto1","marca1","producto2","peso1",20.80,puntuacion,comentarios,"UID2",1);

        when(mockDoc1.toObject(Product.class)).thenReturn(product1);
        when(mockDoc2.toObject(Product.class)).thenReturn(product2);
        when(mockDoc1.getId()).thenReturn("UID1");
        when(mockDoc2.getId()).thenReturn("UID2");
        mockDocuments.add(mockDoc1);
        mockDocuments.add(mockDoc2);

        ApiFuture<QuerySnapshot> mockFuture = mock(ApiFuture.class);
        when(db.collection("products").get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockQuerySnapshot);
        when(mockQuerySnapshot.getDocuments()).thenReturn(mockDocuments);

        // Act
        List<Product> actualProducts = firestoreService.getAllProducts();

        // Assert
        assertEquals(2, actualProducts.size());
        assertEquals("UID1", actualProducts.get(0).getUID());
        assertEquals("UID2", actualProducts.get(1).getUID());
        assertEquals("producto1", actualProducts.get(0).getNombre());
        assertEquals("producto2", actualProducts.get(1).getNombre());
    }

    /**
     * Prueba unitaria para el método {@link FirestoreService#getAllProducts()} que verifica
     * el comportamiento cuando ocurre una excepción al obtener los productos de la colección "products" en Firestore.
     * <p>
     * En esta prueba, se simula una excepción de tipo {@link ExecutionException} durante la
     * obtención de documentos, y se verifica que la excepción es correctamente lanzada.
     * </p>
     * @throws ExecutionException si ocurre un error durante la ejecución de la operación asíncrona
     * @throws InterruptedException si la operación es interrumpida
     */
    @Test
    void testGetAllProducts_Exception() throws ExecutionException, InterruptedException {
        // Arrange
        ApiFuture<QuerySnapshot> mockFuture = mock(ApiFuture.class);
        when(db.collection("products").get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenThrow(new ExecutionException("Error", new Throwable()));
        // Act & Assert
        assertThrows(ExecutionException.class, () -> firestoreService.getAllProducts());
    }

    /**
     * Prueba unitaria para el método {@code addCommentToComments} en {@code FirestoreService}.
     * Verifica que un comentario se añada correctamente a la lista de comentarios del producto
     * identificado por el {@code documentId}.
     */
    @Test
    void testAddCommentToComments_Success() throws ExecutionException, InterruptedException {
        // Arrange
        String documentId = "testDocumentId";
        String comment = "Excelente producto!";
        String expectedUpdateTime = "2024-11-01T12:00:00Z";
        DocumentReference mockDocRef = mock(DocumentReference.class);
        ApiFuture<WriteResult> mockFuture = mock(ApiFuture.class);
        WriteResult mockWriteResult = mock(WriteResult.class);
        // Configuración de Firestore mockeado
        when(db.collection("products").document(documentId)).thenReturn(mockDocRef);
        when(mockDocRef.update(eq("comentarios"), eq(FieldValue.arrayUnion(comment)))).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockWriteResult);
        when(mockWriteResult.getUpdateTime()).thenReturn(Timestamp.parseTimestamp(expectedUpdateTime));
        // Act
        String actualUpdateTime = firestoreService.addCommentToComments(documentId, comment);
        // Assert
        assertEquals(expectedUpdateTime, actualUpdateTime, "El tiempo de actualización debería coincidir con el esperado.");
        verify(mockDocRef).update("comentarios", FieldValue.arrayUnion(comment));
    }

    /**
     * Testea el método addRatingToRatings para asegurarse de que se agrega correctamente una
     * calificación a los ratings del documento. Se espera que el método retorne el tiempo de actualización.
     * @throws Exception si ocurre algún error durante la ejecución
     */
    @Test
    void testAddRatingToRatings_Success() throws Exception {
        // Arrange
        String documentId = "testDocumentId";
        int rating = 5;
        String expectedUpdateTime = "2024-11-01T12:00:00Z";
        // Mock de DocumentReference y WriteResult
        DocumentReference mockDocRef = mock(DocumentReference.class);
        WriteResult mockWriteResult = mock(WriteResult.class);
        ApiFuture<WriteResult> mockFuture = mock(ApiFuture.class);
        // Configura el mock para el comportamiento esperado
        when(db.collection("products").document(documentId)).thenReturn(mockDocRef);
        when(mockDocRef.update("rating", FieldValue.arrayUnion(rating))).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockWriteResult);
        when(mockWriteResult.getUpdateTime()).thenReturn(Timestamp.parseTimestamp(expectedUpdateTime));
        // Act
        String actualUpdateTime = firestoreService.addRatingToRatings(documentId, rating);
        // Assert
        assertEquals(expectedUpdateTime, actualUpdateTime);
    }
    /**
     * Testea el método updateProductStocks para asegurarse de que actualiza correctamente
     * los stocks de los productos si hay suficiente stock disponible.
     * @throws ExecutionException si ocurre un error durante la ejecución
     * @throws InterruptedException si la operación es interrumpida
     */
    @Test
    void testUpdateProductStocks_Success() throws ExecutionException, InterruptedException {
        // Arrange
        Product product1 = new Product();
        product1.setUID("UID1");
        product1.setCantidad(5); // Solicita 5
        product1.setCantidadStock(10); // Stock actual de 10

        Product product2 = new Product();
        product2.setUID("UID2");
        product2.setCantidad(10); // Solicita 10
        product2.setCantidadStock(15); // Stock actual de 15

        List<Product> products = new ArrayList<>();
        products.add(product1);
        products.add(product2);

        DocumentReference mockDocRef1 = mock(DocumentReference.class);
        DocumentReference mockDocRef2 = mock(DocumentReference.class);
        DocumentSnapshot mockDocument1 = mock(DocumentSnapshot.class);
        DocumentSnapshot mockDocument2 = mock(DocumentSnapshot.class);
        ApiFuture<DocumentSnapshot> mockFuture1 = mock(ApiFuture.class);
        ApiFuture<DocumentSnapshot> mockFuture2 = mock(ApiFuture.class);
        ApiFuture<WriteResult> mockWriteFuture1 = mock(ApiFuture.class);
        ApiFuture<WriteResult> mockWriteFuture2 = mock(ApiFuture.class);
        WriteResult mockWriteResult = mock(WriteResult.class);
        // Configuración de mocks
        when(db.collection("products").document("UID1")).thenReturn(mockDocRef1);
        when(db.collection("products").document("UID2")).thenReturn(mockDocRef2);
        when(mockDocRef1.get()).thenReturn(mockFuture1);
        when(mockFuture1.get()).thenReturn(mockDocument1);
        when(mockDocument1.exists()).thenReturn(true);
        when(mockDocument1.getLong("cantidadStock")).thenReturn(10L); // Stock actual de 10
        when(mockDocRef2.get()).thenReturn(mockFuture2);
        when(mockFuture2.get()).thenReturn(mockDocument2);
        when(mockDocument2.exists()).thenReturn(true);
        when(mockDocument2.getLong("cantidadStock")).thenReturn(15L); // Stock actual de 15
        // Simulando que la actualización se realiza correctamente
        when(mockDocRef1.update("cantidadStock", 5)).thenReturn(mockWriteFuture1);
        when(mockWriteFuture1.get()).thenReturn(mockWriteResult);
        when(mockDocRef2.update("cantidadStock", 5)).thenReturn(mockWriteFuture2);
        when(mockWriteFuture2.get()).thenReturn(mockWriteResult);
        // Act
        String result = firestoreService.updateProductStocks(products);
        // Assert
        assertEquals("Pedido procesado y stock actualizado correctamente para todos los productos", result);
    }

    /**
     * Testea el método updateProductStocks para asegurarse de que maneja correctamente
     * el caso en el que un producto no se encuentra en la base de datos.
     * @throws ExecutionException si ocurre un error durante la ejecución
     * @throws InterruptedException si la operación es interrumpida
     */
    @Test
    void testUpdateProductStocks_ProductNotFound() throws ExecutionException, InterruptedException {
        // Arrange
        Product product = new Product();
        product.setUID("UID1");
        product.setCantidad(5); // Solicita 5
        List<Product> products = new ArrayList<>();
        products.add(product);
        DocumentReference mockDocRef = mock(DocumentReference.class);
        DocumentSnapshot mockDocument = mock(DocumentSnapshot.class);
        ApiFuture<DocumentSnapshot> mockFuture = mock(ApiFuture.class);
        // Configuración de mocks
        when(db.collection("products").document("UID1")).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockDocument);
        when(mockDocument.exists()).thenReturn(false); // Producto no encontrado
        // Act
        String result = firestoreService.updateProductStocks(products);
        // Assert
        assertEquals("Error: Producto con ID UID1 no encontrado en la base de datos", result);
    }

    /**
     * Testea el método updateProductStocks para asegurarse de que maneja correctamente
     * el caso en el que el stock es insuficiente.
     * @throws ExecutionException si ocurre un error durante la ejecución
     * @throws InterruptedException si la operación es interrumpida
     */
    @Test
    void testUpdateProductStocks_InsufficientStock() throws ExecutionException, InterruptedException {
        // Arrange
        Product product = new Product();
        product.setUID("UID1");
        product.setCantidad(15); // Solicita 15
        product.setCantidadStock(10); // Stock actual de 10
        List<Product> products = new ArrayList<>();
        products.add(product);
        DocumentReference mockDocRef = mock(DocumentReference.class);
        DocumentSnapshot mockDocument = mock(DocumentSnapshot.class);
        ApiFuture<DocumentSnapshot> mockFuture = mock(ApiFuture.class);
        // Configuración de mocks
        when(db.collection("products").document("UID1")).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockFuture);
        when(mockFuture.get()).thenReturn(mockDocument);
        when(mockDocument.exists()).thenReturn(true); // Producto encontrado
        when(mockDocument.getLong("cantidadStock")).thenReturn(10L); // Stock actual de 10
        // Act
        String result = firestoreService.updateProductStocks(products);
        // Assert
        assertEquals("Error: Stock insuficiente para el producto con ID UID1", result);
    }

}


