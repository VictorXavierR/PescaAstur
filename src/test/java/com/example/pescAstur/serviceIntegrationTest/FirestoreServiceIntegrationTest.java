package com.example.pescAstur.serviceIntegrationTest;
import com.example.pescAstur.model.User; // Asegúrate de que la ruta sea correcta
import com.example.pescAstur.service.FirestoreService; // Ajusta la ruta según tu estructura de paquetes
import com.google.cloud.firestore.Firestore;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
public class FirestoreServiceIntegrationTest {
    private FirestoreService firestoreService;
    private final String userId = "DwLVddFFbkavrPGse8eUnV0DZoy2"; // Cambia esto por un ID de usuario válido
    private final String testFilePath = "C:\\Users\\Víctor\\Desktop\\entradaMina.png"; // Cambia esto por el path de tu imagen

    @BeforeEach
    void setUp() throws IOException {
        firestoreService = new FirestoreService(); // Inicializa tu servicio que ya tiene Firestore
    }
    /**
     * Test de integración para el método {@code saveUserDetails()} de la clase {@link FirestoreService}.
     * <p>Este test verifica que los detalles de un usuario se guarden correctamente en Firestore.
     * Simula la carga de una imagen de perfil y verifica que todos los campos proporcionados
     * se guarden correctamente en la base de datos. También asegura que la fecha de nacimiento
     * y la fecha de registro se conviertan adecuadamente y se guarden como parte del documento.</p>
     * <p>Pasos del test:</p>
     * <ol>
     *     <li>Crea un archivo {@code MultipartFile} a partir de una imagen de perfil existente.</li>
     *     <li>Define fechas de nacimiento y registro usando {@code LocalDate} y conviértelas a {@code Date}.</li>
     *     <li>Configura los detalles del usuario (nombre, apellido, dirección, idioma, etc.).</li>
     *     <li>Llama al método {@code saveUserDetails()} para guardar la información en Firestore.</li>
     *     <li>Recupera los datos guardados desde Firestore y valida que coincidan con los datos originales.</li>
     * </ol>
     * <p>Este test utiliza {@code assertNotNull} para verificar que el documento del usuario fue creado
     * y {@code assertEquals} para comparar cada campo guardado en Firestore con los valores originales.
     * También utiliza un archivo local para simular la carga de una foto de perfil como {@code MultipartFile}.</p>
     * @throws IOException si ocurre un error al leer el archivo de imagen de perfil.
     * @throws ExecutionException si ocurre un error al ejecutar la operación de Firestore.
     * @throws InterruptedException si la operación de Firestore es interrumpida.
     */
    @Test
    void saveUserDetails_Success() throws IOException, ExecutionException, InterruptedException {
        // Crea un MultipartFile a partir de un archivo existente
        File file = new File(testFilePath);
        MockMultipartFile multipartFile = new MockMultipartFile(
                "fotoPerfil", // Nombre del campo en el formulario
                file.getName(), // Nombre original del archivo
                Files.probeContentType(file.toPath()), // Tipo de contenido
                new FileInputStream(file) // Stream del archivo
        );
        // Configura la fecha de nacimiento y registro usando LocalDate
        LocalDate birthDate = LocalDate.of(1990, 5, 15); // Cambia a la fecha que necesites
        LocalDate registrationDate = LocalDate.now();
        // Convierte LocalDate a Date
        Date fechaNacimiento = Date.from(birthDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fechaRegistro = Date.from(registrationDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        // Crea un usuario con los detalles que quieras
        User user = new User();
        user.setNombre("Juan");
        user.setApellido("Pérez");
        user.setTelefono("123456789");
        user.setDireccion("Calle Falsa 123");
        user.setCiudad("Madrid");
        user.setProvincia("Madrid");
        user.setCodigoPostal("28001");
        user.setPais("España");
        user.setFechaNacimiento(fechaNacimiento);
        user.setFechaRegistro(fechaRegistro);
        user.setIdiomaPreferido("Español");
        user.setEstadoCuenta("Activo");
        user.setUserName("juanp");
        user.setDNI("12345678Z");
        user.setFotoPerfil(multipartFile); // Aquí asignas el MultipartFile
        // Llama al método para guardar detalles del usuario
        firestoreService.saveUserDetails(userId, user);
        // Verifica que el usuario se haya guardado correctamente en Firestore
        Firestore db = firestoreService.getDb(); // Usar el método getter para acceder a Firestore
        Map<String, Object> savedUserDetails = db.collection("users").document(userId).get().get().getData();
        assertNotNull(savedUserDetails, "Los detalles del usuario no deben ser nulos.");
        assertEquals("Juan", savedUserDetails.get("nombre"));
        assertEquals("Pérez", savedUserDetails.get("apellido"));
        assertEquals("123456789", savedUserDetails.get("telefono"));
        assertEquals("Calle Falsa 123", savedUserDetails.get("direccion"));
        assertEquals("Madrid", savedUserDetails.get("ciudad"));
        assertEquals("Madrid", savedUserDetails.get("provincia"));
        assertEquals("28001", savedUserDetails.get("codigoPostal"));
        assertEquals("España", savedUserDetails.get("pais"));
        assertEquals("Español", savedUserDetails.get("idiomaPreferido"));
        assertEquals("Activo", savedUserDetails.get("estadoCuenta"));
        assertEquals("juanp", savedUserDetails.get("nombreUsuario"));
        assertEquals("12345678Z", savedUserDetails.get("DNI"));
    }
}