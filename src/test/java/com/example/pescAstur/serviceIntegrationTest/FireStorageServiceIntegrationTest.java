package com.example.pescAstur.serviceIntegrationTest;
import com.example.pescAstur.service.FireStorageService;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.springframework.mock.web.MockMultipartFile;
import java.io.File;
import java.io.IOException;
import static org.junit.jupiter.api.Assertions.assertNotNull;
@SpringBootTest
public class FireStorageServiceIntegrationTest {
    private FireStorageService fireStorageService; // El servicio que contiene deleteFile

    @BeforeEach
    void setUp() throws Exception {
        fireStorageService= new FireStorageService();
    }

    /**
     * Test de integración para convertir un MultipartFile a un archivo temporal.
     * <p>Este test verifica que el archivo temporal se crea correctamente.
     */
    @Test
    void convertToFile_Success() throws IOException {
        // Crea un archivo MultipartFile simulado
        MockMultipartFile mockFile = new MockMultipartFile("testfile", "test.txt", "text/plain", "Este es el contenido del archivo".getBytes());

        // Llama al método para convertir a archivo temporal
        File tempFile = fireStorageService.convertToFile(mockFile);

        // Verifica que el archivo temporal no es nulo y que existe en el sistema de archivos
        assertNotNull(tempFile, "El archivo temporal no debería ser nulo.");
        assertTrue(tempFile.exists(), "El archivo temporal debería existir.");

        // Limpia el archivo temporal después de la prueba
        tempFile.delete();
    }

}
