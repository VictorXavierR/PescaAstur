package com.example.pescAstur.serviceTest;
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
import java.util.Date;
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


    @BeforeEach
    void setUp() {
        CollectionReference usersCollection = mock(CollectionReference.class);
        lenient().when(db.collection("users")).thenReturn(usersCollection);
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
        // ... (resto de las verificaciones)

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

}


