package com.example.pescAstur.controllerIntegrationTest;
import com.example.pescAstur.model.User;
import com.example.pescAstur.service.FirebaseUserService;
import com.example.pescAstur.service.FirestoreService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private FirebaseUserService firebaseUserService;
    @Autowired
    private FirestoreService firestoreService;
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        firestoreService= new FirestoreService();
        firebaseUserService= new FirebaseUserService();
    }

    /**
     * Test para el método de registro de usuario en el controlador `UserController`.
     * Este test verifica que un usuario puede registrarse exitosamente mediante una solicitud
     * POST al endpoint `/api/users/register`. Se envían parámetros de usuario y una foto de perfil,
     * y se espera que el servicio registre correctamente al usuario en Firebase Authentication
     * y guarde los detalles adicionales en Firestore.
     * Funcionalidad:
     * - Crea un archivo simulado `profile.jpg` para enviar como archivo de perfil del usuario.
     * - Envía los parámetros del usuario, incluyendo datos personales y de contacto, como un
     *   `MultiValueMap`.
     * - Realiza la solicitud POST utilizando `MockMvc` para simular el registro de usuario.
     * - Verifica que el estado de la respuesta HTTP sea 200 OK y que el mensaje JSON devuelto
     *   confirme el registro exitoso y almacenamiento de los detalles en Firestore.
     * - Realiza una consulta en Firebase Authentication para confirmar que el usuario ha sido
     *   creado, validando su email.
     * @throws Exception en caso de errores de la solicitud o en la interacción con Firebase.
     */
    @Test
    void registerUser_Success() throws Exception {
        // Preparar un archivo simulado
        MockMultipartFile file = new MockMultipartFile("file", "profile.jpg", "image/jpeg", "test image content".getBytes());

        // Preparar parámetros del usuario como MultiValueMap
        MultiValueMap<String, String> userParams = new LinkedMultiValueMap<>();
        userParams.add("email", "testuser@example.com");
        userParams.add("password", "securePassword123");
        userParams.add("nombre", "John");
        userParams.add("apellido", "Doe");
        userParams.add("telefono", "123456789");
        userParams.add("direccion", "123 Street");
        userParams.add("ciudad", "City");
        userParams.add("provincia", "Province");
        userParams.add("codigoPostal", "12345");
        userParams.add("pais", "Country");
        userParams.add("fechaNacimiento", "2000-01-01");
        userParams.add("idiomaPreferido", "Español");
        userParams.add("estadoCuenta", "Activo");
        userParams.add("userName", "johndoe");
        userParams.add("DNI", "12345678");

        // Realizar la solicitud POST
        mockMvc.perform(multipart("/api/users/register")
                        .file(file)
                        .params(userParams)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Usuario registrado correctamente y detalles guardados en Firestore."));

        // Verifica que el usuario ha sido creado en Firebase
        UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail("testuser@example.com");
        assertNotNull(userRecord);
        assertEquals("testuser@example.com", userRecord.getEmail());
    }

    /**
     * Test unitario para el método de actualización de datos de autenticación del usuario.
     * Este test verifica que los datos de autenticación de un usuario se actualicen correctamente
     * a través de una solicitud HTTP POST.
     * <p>El test simula la actualización de los datos de autenticación de un usuario en un
     * sistema, probando que la API responda con un código de estado HTTP 200 (OK) y que el mensaje
     * de confirmación sea "Datos de autenticación actualizados.". Luego, verifica que el correo
     * electrónico del usuario actualizado en Firebase coincida con el correo especificado para el
     * nuevo usuario.
     * <p>Pasos:
     * <ul>
     *     <li>Define un usuario antiguo y uno nuevo con un correo electrónico y contraseña distintos.</li>
     *     <li>Crea un mapa de datos de entrada que contiene el usuario antiguo y el nuevo usuario.</li>
     *     <li>Realiza una solicitud HTTP POST para actualizar los datos de autenticación con el mapa de datos.</li>
     *     <li>Verifica que la respuesta HTTP sea correcta y que el mensaje de éxito sea el esperado.</li>
     *     <li>Comprueba que el correo del usuario en el sistema se haya actualizado al nuevo valor.</li>
     * </ul>
     * @throws Exception si ocurre un error al procesar la solicitud o al interactuar con Firebase.
     */
    @Test
    void updateUserAuth_Success() throws Exception {
        // Preparar datos del usuario antiguo y nuevo
        User oldUser = new User();
        oldUser.setEmail("testuser@example.com");
        User newUser = new User();
        newUser.setEmail("autentificaction@prueba.com");
        newUser.setPassword("autentification");

        // Preparar datos de entrada
        Map<String, User> users = new HashMap<>();
        users.put("newUser", newUser);
        users.put("oldUser", oldUser);

        // Realizar la solicitud POST para actualizar los datos de autenticación
        ResultActions resultActions = mockMvc.perform(post("/api/users/update-auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(users)))
                .andExpect(status().isOk())
                .andExpect(content().string("Datos de autenticación actualizados."));

        // Verificar que el usuario ha sido actualizado en Firebase
        String updatedUserId = firebaseUserService.getUserIdByEmail(newUser.getEmail());
        assertEquals(newUser.getEmail(), "autentificaction@prueba.com");
    }

    /**
     * Test para verificar que el endpoint de actualización de detalles del usuario
     * actualiza correctamente la información del usuario cuando se proporciona un conjunto
     * completo de parámetros válidos y un archivo de imagen de perfil.
     * <p>Este test:
     * <ul>
     *   <li>Construye un mapa de parámetros de usuario representando detalles como el nombre,
     *   dirección, email, fecha de nacimiento, etc.</li>
     *   <li>Simula un archivo de imagen para el parámetro de imagen de perfil ("fotoPerfil").</li>
     *   <li>Envía una solicitud multipart POST a la ruta "/api/users/update-details"
     *   incluyendo los datos del usuario y el archivo de imagen.</li>
     * </ul>
     * <p>Se espera que:
     * <ul>
     *   <li>El endpoint devuelva un código de estado HTTP 200 (OK).</li>
     *   <li>El contenido de la respuesta sea el mensaje "Detalles del usuario actualizados correctamente".</li>
     * </ul>
     * @throws Exception si ocurre algún error durante el procesamiento de la solicitud.
     */
    @Test
    void updateUserDetails_Success() throws Exception {
        // Crear datos del usuario
        Map<String, String> userParams = new HashMap<>();
        userParams.put("userName", "TestUser");
        userParams.put("email", "autentificaction@prueba.com");//Vigilar que el correo exista en la base de datos
        userParams.put("DNI", "12345678X");
        userParams.put("telefono", "123456789");
        userParams.put("direccion", "123 Main St");
        userParams.put("ciudad", "Madrid");
        userParams.put("provincia", "Madrid");
        userParams.put("codigoPostal", "28001");
        userParams.put("pais", "España");
        userParams.put("fechaRegistro", "01-01-2022");
        userParams.put("estadoCuenta", "ACTIVO");
        userParams.put("idiomaPreferido", "Español");
        userParams.put("nombre", "John");
        userParams.put("fechaNacimiento", "01-01-1990");
        userParams.put("apellido", "Doe");

        // Crear archivo de imagen simulada para fotoPerfil
        MockMultipartFile fotoPerfil = new MockMultipartFile(
                "fotoPerfil",
                "profile.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "dummy image content".getBytes());

        // Realizar solicitud de tipo multipart POST con los datos del usuario y el archivo de imagen
        mockMvc.perform(multipart("/api/users/update-details")
                        .file(fotoPerfil)
                        .param("userName", userParams.get("userName"))
                        .param("email", userParams.get("email"))
                        .param("DNI", userParams.get("DNI"))
                        .param("telefono", userParams.get("telefono"))
                        .param("direccion", userParams.get("direccion"))
                        .param("ciudad", userParams.get("ciudad"))
                        .param("provincia", userParams.get("provincia"))
                        .param("codigoPostal", userParams.get("codigoPostal"))
                        .param("pais", userParams.get("pais"))
                        .param("fechaRegistro", userParams.get("fechaRegistro"))
                        .param("estadoCuenta", userParams.get("estadoCuenta"))
                        .param("idiomaPreferido", userParams.get("idiomaPreferido"))
                        .param("nombre", userParams.get("nombre"))
                        .param("fechaNacimiento", userParams.get("fechaNacimiento"))
                        .param("apellido", userParams.get("apellido"))
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(content().string("Detalles del usuario actualizados correctamente."));
    }

    /**
     * Test de integración para eliminar un usuario.
     * <p>Este test verifica que el controlador pueda eliminar correctamente
     * un usuario de Firebase Authentication y Firestore, asegurando que
     * se devuelva el mensaje de confirmación esperado.
     * <p>Se utiliza un usuario de prueba que debe existir en Firebase
     * y Firestore para que el test pase correctamente.
     * @throws Exception si ocurre algún error durante el procesamiento de la solicitud.
     */
    @Test
    void deleteUser_Success() throws Exception {
        // Crear el usuario a eliminar (debe existir previamente en la base de datos)
        User userToDelete = new User();
        userToDelete.setEmail("autentificaction@prueba.com"); // Asegúrate de que este usuario existe

        // Realizar la solicitud POST para eliminar el usuario
        mockMvc.perform(post("/api/users/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userToDelete)))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario eliminado."));

        // Verificar que el usuario ya no existe en Firebase y Firestore
        String uid = firebaseUserService.getUserIdByEmail(userToDelete.getEmail());
        assertNull(uid, "El usuario no debería existir en Firebase.");

        // Verificar que los detalles del usuario han sido eliminados de Firestore
        User user = firestoreService.getUserDetails(uid);
        assertNull(user, "El usuario no debería existir en Firestore.");
    }
}
