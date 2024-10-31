package com.example.pescAstur.serviceTest;
import com.example.pescAstur.service.FireStorageService;
import com.google.cloud.storage.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class FireStorageServiceTest {


    @TempDir
    Path tempDir;

    @Mock
    private Storage storage; // Mock del objeto Storage

    @Mock
    private Bucket bucket; // Mock del objeto Bucket

    @Mock
    private Blob blob; // Mock del objeto Blob

    @Mock
    private MultipartFile file; // Mock del objeto MultipartFile

    @InjectMocks
    private FireStorageService fireStorageService; // Instancia del servicio a probar

    @BeforeEach
    public void setUp() {
    }

    @Test
    public void testDeleteFileSuccess() {
        String fileName = "test-file.txt";
        BlobId blobId = BlobId.of("pescaastur-160f4.appspot.com", fileName);

        // Simulamos que el archivo se elimina exitosamente
        when(storage.delete(blobId)).thenReturn(true);

        // Llamamos al método deleteFile
        boolean result = fireStorageService.deleteFile(fileName);

        // Verificamos que se haya llamado al método delete con el blobId correcto
        verify(storage, times(1)).delete(blobId);

        // Aseguramos que el resultado es verdadero
        assertTrue(result, "El archivo debería haberse eliminado con éxito");
    }

    @Test
    public void testDeleteFileNotFound() {
        String fileName = "non-existent-file.txt";
        BlobId blobId = BlobId.of("pescaastur-160f4.appspot.com", fileName);

        // Simulamos que el archivo no se encuentra
        when(storage.delete(blobId)).thenReturn(false); // Simulando que el archivo no existe

        // Llamamos al método deleteFile y verificamos el resultado
        boolean result = fireStorageService.deleteFile(fileName);

        // Verificamos que se haya llamado al método delete con el blobId correcto
        verify(storage, times(1)).delete(blobId);

        // Aseguramos que el resultado es falso
        assertFalse(result, "El archivo no debería haberse encontrado para eliminar");
    }

    /**
     * Prueba la carga exitosa de una foto de perfil.
     * <p>
     * Esta prueba verifica que el método {@code uploadProfilePhoto} de {@code FireStorageService}
     * maneja correctamente el proceso de carga, incluyendo:
     * <ul>
     *     <li>Interacción adecuada con el bucket de Google Cloud Storage</li>
     *     <li>Manejo correcto del MultipartFile</li>
     *     <li>Generación de un nombre de archivo con prefijo UUID</li>
     *     <li>Devolución de la URL de descarga correcta</li>
     * </ul>
     * </p>
     * @throws IOException si ocurre un error de E/S durante la prueba
     */
    @Test
    public void testUploadProfilePhotoSuccess() throws IOException {
        // Preparar datos de prueba
        String originalFilename = "profile.jpg";
        String userId = UUID.randomUUID().toString();

        // Simulamos el comportamiento del MultipartFile
        when(file.getOriginalFilename()).thenReturn(originalFilename);
        when(file.getBytes()).thenReturn("file-content".getBytes());
        when(file.getContentType()).thenReturn("image/jpeg");

        // Simulamos que el bucket se obtiene correctamente
        when(storage.get("pescaastur-160f4.appspot.com")).thenReturn(bucket);

        // Simulamos la creación del blob en el bucket
        when(bucket.create(argThat(filename -> filename.endsWith(originalFilename)),
                any(byte[].class),
                eq("image/jpeg")))
                .thenReturn(blob);

        // Simulamos el comportamiento del blob
        when(blob.getName()).thenAnswer(invocation ->
                UUID.randomUUID().toString() + "-" + originalFilename
        );

        // Llamamos al método uploadProfilePhoto
        String downloadUrl = fireStorageService.uploadProfilePhoto(file, userId);

        // Verificaciones
        System.out.println("Actual downloadUrl: " + downloadUrl);

        assertTrue(downloadUrl.endsWith(originalFilename),
                "La URL de descarga no termina con el nombre de archivo original");
        assertTrue(downloadUrl.matches("[\\w-]+-" + originalFilename),
                "La URL de descarga no tiene el formato esperado (UUID-nombreArchivo)");
        verify(storage, times(1)).get("pescaastur-160f4.appspot.com");
        verify(bucket, times(1)).create(argThat(filename -> filename.endsWith(originalFilename)),
                any(byte[].class),
                eq("image/jpeg"));
    }


    /**
     * Prueba el manejo de errores al cargar una foto de perfil.
     * <p>
     * Esta prueba verifica que el método {@code uploadProfilePhoto} de {@code FireStorageService}
     * maneja correctamente los escenarios de error, incluyendo:
     * <ul>
     *     <li>Manejo adecuado de excepciones al interactuar con Google Cloud Storage</li>
     *     <li>Lanzamiento de una excepción apropiada cuando la carga falla</li>
     *     <li>No creación del blob en caso de error</li>
     * </ul>
     * </p>
     * @throws IOException si ocurre un error de E/S durante la prueba
     */
    @Test
    public void testUploadProfilePhotoFailure() throws IOException {
        // Preparar datos de prueba
        String originalFilename = "profile.jpg";
        String userId = UUID.randomUUID().toString();

        // Simulamos el comportamiento del MultipartFile
        when(file.getOriginalFilename()).thenReturn(originalFilename);
        when(file.getBytes()).thenReturn("file-content".getBytes());
        when(file.getContentType()).thenReturn("image/jpeg");

        // Simulamos que el bucket se obtiene correctamente
        when(storage.get("pescaastur-160f4.appspot.com")).thenReturn(bucket);

        // Simulamos un error al crear el blob en el bucket
        when(bucket.create(any(String.class), any(byte[].class), any(String.class)))
                .thenThrow(new StorageException(500, "Error al crear el blob"));

        // Verificamos que se lanza una excepción al llamar al método uploadProfilePhoto
        Exception exception = assertThrows(RuntimeException.class, () -> {
            fireStorageService.uploadProfilePhoto(file, userId);
        });
        // Verificaciones
        String expectedMessage = "Error al crear el blob";
        String actualMessage = exception.getMessage();

        System.out.println("Mensaje de excepción actual: " + actualMessage);

        assertTrue(actualMessage.contains(expectedMessage),
                "El mensaje de excepción no contiene el texto esperado. " +
                        "Esperado: '" + expectedMessage + "', Actual: '" + actualMessage + "'");

        verify(storage, times(1)).get("pescaastur-160f4.appspot.com");
        verify(bucket, times(1)).create(any(String.class), any(byte[].class), any(String.class));
        verify(blob, never()).getName(); // Verificamos que nunca se llama a getName() del blob
    }

    /**
     * Prueba la conversión exitosa de un MultipartFile a File.
     * <p>
     * Este test verifica que el método {@code convertToFile} convierte correctamente
     * un objeto MultipartFile a un objeto File, asegurando que:
     * <ul>
     *     <li>El archivo se crea correctamente en el sistema de archivos temporal</li>
     *     <li>El contenido del archivo creado coincide con el contenido original del MultipartFile</li>
     *     <li>El nombre del archivo creado coincide con el nombre original del MultipartFile</li>
     * </ul>
     * </p>
     * @throws IOException si ocurre un error de E/S durante la prueba
     */
    @Test
    void testConvertToFileSuccess() throws IOException {
        // Arrange
        String fileName = "test.txt";
        String content = "Hello, World!";
        MultipartFile multipartFile = new MockMultipartFile(fileName, fileName, "text/plain", content.getBytes());

        // Act
        File result = fireStorageService.convertToFile(multipartFile);

        // Assert
        assertTrue(result.exists(), "El archivo debe existir");
        assertEquals(fileName, result.getName(), "El nombre del archivo debe coincidir");
        String fileContent = new String(Files.readAllBytes(result.toPath()));
        assertEquals(content, fileContent, "El contenido del archivo debe coincidir");
    }

}



