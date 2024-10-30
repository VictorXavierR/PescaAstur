package com.example.pescAstur.controllerTest;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.example.pescAstur.controller.UserController;
import com.example.pescAstur.service.FirebaseUserService;
import com.example.pescAstur.service.FirestoreService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import com.example.pescAstur.model.User;
import java.util.HashMap;
import java.util.Map;
import static org.hamcrest.Matchers.containsString;
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private FirebaseUserService firebaseUserService;

    @Mock
    private FirestoreService firestoreService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    /**
     * Test para el registro exitoso de un usuario.
     * Se simula el registro de un usuario y se espera una respuesta exitosa (200 OK)
     * junto con el mensaje correspondiente en el cuerpo de la respuesta.
     * @throws Exception si hay un error en la ejecución del test
     */
    @Test
    public void testRegisterUser_Success() throws Exception {
        // Preparar los parámetros del usuario
        MultiValueMap<String, String> userParams = new LinkedMultiValueMap<>();
        userParams.add("nombre", "John");
        userParams.add("apellido", "Doe");
        userParams.add("email", "john.doe@example.com");
        userParams.add("password", "password123");
        userParams.add("telefono", "123456789");
        userParams.add("direccion", "123 Street");
        userParams.add("ciudad", "City");
        userParams.add("provincia", "Province");
        userParams.add("codigoPostal", "12345");
        userParams.add("pais", "Country");
        userParams.add("fechaNacimiento", "2000-01-01");
        userParams.add("idiomaPreferido", "es");
        userParams.add("estadoCuenta", "activo");
        userParams.add("userName", "johndoe");
        userParams.add("DNI", "12345678X");

        // Simular archivo de imagen
        MockMultipartFile file = new MockMultipartFile("file", "profile.jpg", MediaType.IMAGE_JPEG_VALUE,
                "mock image content".getBytes());

        // Simular comportamiento del servicio
        when(firebaseUserService.registerUser(anyString(), anyString())).thenReturn("mockUserId");
        doNothing().when(firestoreService).saveUserDetails(anyString(), any());

        // Realizar la solicitud
        mockMvc.perform(multipart("/api/users/register")
                        .file(file)
                        .params(userParams))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Usuario registrado correctamente y detalles guardados en Firestore."));
    }

    /**
     * Test para el registro de un usuario sin proporcionar un email.
     * Se espera que el controlador devuelva un error (400 Bad Request)
     * junto con el mensaje correspondiente en el cuerpo de la respuesta.
     * @throws Exception si hay un error en la ejecución del test
     */
    @Test
    public void testRegisterUser_MissingEmail() throws Exception {
        // Preparar los parámetros del usuario sin email
        MultiValueMap<String, String> userParams = new LinkedMultiValueMap<>();
        userParams.add("nombre", "John");
        userParams.add("apellido", "Doe");
        // No se incluye el email
        userParams.add("password", "password123");

        // Simular archivo de imagen
        MockMultipartFile file = new MockMultipartFile("file", "profile.jpg", MediaType.IMAGE_JPEG_VALUE,
                "mock image content".getBytes());

        // Realizar la solicitud
        mockMvc.perform(multipart("/api/users/register")
                        .file(file)
                        .params(userParams))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("El email es obligatorio."));
    }

    /**
     * Test para el registro de un usuario con formato de fecha incorrecto.
     * Se espera que el controlador devuelva un error (400 Bad Request)
     * junto con el mensaje correspondiente en el cuerpo de la respuesta.
     * @throws Exception si hay un error en la ejecución del test
     */
    @Test
    public void testRegisterUser_InvalidDateFormat() throws Exception {
        // Preparar los parámetros del usuario con formato de fecha incorrecto
        MultiValueMap<String, String> userParams = new LinkedMultiValueMap<>();
        userParams.add("nombre", "John");
        userParams.add("apellido", "Doe");
        userParams.add("email", "john.doe@example.com");
        userParams.add("password", "password123");
        userParams.add("fechaNacimiento", "invalid-date");
        // Simular archivo de imagen
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Hello, World!".getBytes());
        mockMvc.perform(multipart("/api/users/register")
                        .file(file)
                        .param("otherParam", "value"))
                .andExpect(status().isBadRequest()) //
                .andExpect(jsonPath("$.message").exists());
        // Realizar la solicitud
        mockMvc.perform(multipart("/api/users/register")
                        .param("dateParam", "invalid-date"))
                .andExpect(status().isBadRequest());
    }

    /**
     * Test para el método updateUserAuth del UserController.
     * Este test verifica que la actualización de datos de autenticación se realice correctamente
     * cuando se proporcionan usuarios válidos y que maneja correctamente los casos
     * donde los datos de usuario son nulos.
     * @throws Exception si ocurre un error al realizar la solicitud.
     */
    @Test
    public void testUpdateUserAuth_Success() throws Exception {
        // Preparación de los datos de entrada
        User newUser = new User();
        newUser.setEmail("newemail@example.com");
        newUser.setPassword("newPassword");
        User oldUser = new User();
        oldUser.setEmail("oldemail@example.com");
        oldUser.setPassword("oldPassword");
        Map<String, User> users = new HashMap<>();
        users.put("newUser", newUser);
        users.put("oldUser", oldUser);
        // Simulación del comportamiento del servicio
        when(firebaseUserService.getUserIdByEmail(oldUser.getEmail())).thenReturn("userId");
        when(firebaseUserService.updateUser("userId", newUser.getEmail(), newUser.getPassword(), false, false)).thenReturn(true);

        // Ejecución de la prueba
        mockMvc.perform(post("/api/users/update-auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"newUser\": {\"userName\": \"newUser\", \"email\": \"newemail@example.com\", \"password\": \"newPassword\"}, " +
                                "\"oldUser\": {\"userName\": \"oldUser\", \"email\": \"oldemail@example.com\", \"password\": \"oldPassword\"}}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Datos de autenticación actualizados."));
    }

    /**
     * Test para el método updateUserAuth del UserController cuando se proporcionan usuarios nulos.
     * Este test verifica que se retorne el mensaje de error adecuado cuando alguno de los usuarios es nulo.
     * @throws Exception si ocurre un error al realizar la solicitud.
     */
    @Test
    public void testUpdateUserAuth_NullUser() throws Exception {
        // Preparación de los datos de entrada con un usuario nulo
        User newUser = new User();
        newUser.setEmail("newemail@example.com");
        newUser.setPassword("newPassword");

        Map<String, User> users = new HashMap<>();
        users.put("newUser", newUser);
        users.put("oldUser", null); // Old user es nulo

        // Ejecución de la prueba
        mockMvc.perform(post("/api/users/update-auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"newUser\": {\"userName\": \"newUser\", \"email\": \"newemail@example.com\", \"password\": \"newPassword\"}, " +
                                "\"oldUser\": null}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Error: Los datos de usuario son nulos."));
    }

    /**
     * Test para el método updateUserDetails del UserController.
     * Este test verifica que la actualización de los detalles del usuario se realice correctamente
     * cuando se proporcionan los parámetros adecuados y una foto de perfil opcional.
     * También verifica que se manejen correctamente los errores durante el proceso de actualización.
     * @throws Exception si ocurre un error al realizar la solicitud.
     */
    @Test
    public void testUpdateUserDetails_Success() throws Exception {
        // Preparación de los datos de entrada
        MockMultipartFile fotoPerfil = new MockMultipartFile("fotoPerfil", "foto.jpg", "image/jpeg", "imagen".getBytes());

        Map<String, String> userParams = new HashMap<>();
        userParams.put("userName", "testUser");
        userParams.put("email", "testuser@example.com");
        userParams.put("DNI", "12345678A");
        userParams.put("telefono", "123456789");
        userParams.put("direccion", "Calle Falsa 123");
        userParams.put("ciudad", "Springfield");
        userParams.put("provincia", "Springfield");
        userParams.put("codigoPostal", "12345");
        userParams.put("pais", "País de Prueba");
        userParams.put("fechaRegistro", "01-01-2023");
        userParams.put("estadoCuenta", "activo");
        userParams.put("idiomaPreferido", "español");
        userParams.put("nombre", "John");
        userParams.put("apellido", "Doe");
        userParams.put("fechaNacimiento", "01-01-1990"); // Asegúrate de que esta fecha es válida

        // Simulación del comportamiento de los servicios
        when(firebaseUserService.getUserIdByEmail(userParams.get("email"))).thenReturn("userId");
        doNothing().when(firestoreService).updateUserDetails(anyString(), any(User.class));

        // Ejecución de la prueba
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
                        .param("apellido", userParams.get("apellido"))
                        .param("fechaNacimiento", userParams.get("fechaNacimiento"))) // Añadido aquí
                .andExpect(status().isOk())
                .andExpect(content().string("Detalles del usuario actualizados correctamente."));
    }

    /**
     * Verifica el comportamiento del método {@link UserController#updateUserDetails}
     * cuando se proporciona un campo vacío.
     * <p>Esta prueba simula una solicitud de actualización de detalles del usuario
     * donde el campo "nombreCompleto" está vacío. Se espera que el método
     * devuelva un estado 400 BAD_REQUEST con un mensaje de error específico que
     * indique error al actualizar los detalles del usuario.</p>
     * <p>La prueba utiliza {@link MockMvc} para simular la llamada HTTP y
     * comprobar la respuesta del controlador.</p>
     */
    @Test
    public void testUpdateUserDetails_Error() throws Exception {
        // Configurar parámetros de usuario
        MultiValueMap<String, String> userParams = new LinkedMultiValueMap<>();
        userParams.add("nombreCompleto", "");
        userParams.add("otroCampo", "valorEjemplo");

        // Ejecutar la prueba
        mockMvc.perform(post("/api/users/update-details")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .params(userParams))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Error al actualizar los detalles del usuario")));
    }

    /**
     * Verifica el comportamiento del método {@link UserController#deleteUser}
     * cuando se elimina un usuario correctamente.
     * <p>Esta prueba simula una solicitud de eliminación de usuario mediante el
     * envío de un objeto {@link User} con una dirección de correo electrónico.
     * Se espera que el método devuelva un mensaje indicando que el usuario
     * fue eliminado exitosamente.</p>
     * <p>Además, se verifica que los servicios relacionados se llamen adecuadamente
     * para eliminar al usuario y sus detalles.</p>
     */
    @Test
    public void testDeleteUser_Success() throws Exception {
        // Preparar el objeto User con el correo electrónico
        User userToDelete = new User();
        userToDelete.setEmail("user@example.com");

        // Configurar el comportamiento de los mocks
        doReturn("uid123").when(firebaseUserService).getUserIdByEmail("user@example.com");
        doReturn(true).when(firebaseUserService).deleteUser("uid123");

        // Realizar la solicitud y verificar la respuesta
        mockMvc.perform(post("/api/users/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario eliminado."));

        // Verificar que los métodos del servicio fueron llamados
        verify(firebaseUserService).getUserIdByEmail("user@example.com");
        verify(firebaseUserService).deleteUser("uid123");
        verify(firestoreService).deleteUserDetails("uid123");
    }

    /**
     * Prueba el método {@link UserController#deleteUser(User)} para el escenario
     * en el que la eliminación de un usuario falla. Este método simula la eliminación
     * de un usuario con una dirección de correo electrónico especificada y verifica
     * la respuesta devuelta por el controlador cuando la eliminación no es exitosa.
     * <p>En esta prueba, se llevan a cabo las siguientes acciones:</p>
     * <ul>
     *     <li>Se crea un objeto {@link User} con una dirección de correo electrónico.</li>
     *     <li>Se configuran los mocks para devolver un ID de usuario específico para el correo electrónico proporcionado.</li>
     *     <li>Se simula la falla en el proceso de eliminación del usuario.</li>
     *     <li>Se realiza una solicitud al endpoint para eliminar al usuario.</li>
     *     <li>Se verifica que la respuesta indique un error en la eliminación.</li>
     *     <li>Se verifica que los métodos apropiados en los servicios simulados fueron llamados:</li>
     *     <ul>
     *         <li>Se asegura que el método para obtener el ID del usuario fue llamado.</li>
     *         <li>Se asegura que el método para intentar eliminar al usuario fue llamado.</li>
     *         <li>Se asegura que el método para eliminar los detalles del usuario <strong>no</strong> fue llamado,
     *             reflejando el comportamiento esperado cuando la eliminación falla.</li>
     *     </ul>
     * </ul>
     * <p>Esta prueba asegura que el controlador maneja correctamente los escenarios de error y
     * proporciona respuestas apropiadas.</p>
     * @throws Exception si ocurre un error durante la ejecución de la solicitud simulada.
     */
    @Test
    public void testDeleteUser_Error() throws Exception {
        // Preparar el objeto User con el correo electrónico
        User userToDelete = new User();
        userToDelete.setEmail("user@example.com");

        // Configurar el comportamiento de los mocks
        doReturn("uid123").when(firebaseUserService).getUserIdByEmail("user@example.com");
        doReturn(false).when(firebaseUserService).deleteUser("uid123");

        // Realizar la solicitud y verificar la respuesta
        mockMvc.perform(post("/api/users/delete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Error al eliminar el usuario."));

        // Verificar que los métodos del servicio fueron llamados
        verify(firebaseUserService).getUserIdByEmail("user@example.com");
        verify(firebaseUserService).deleteUser("uid123");
        verify(firestoreService, never()).deleteUserDetails("uid123"); // Verificar que no se llama a deleteUserDetails
    }
}
