package com.example.pescAstur.serviceTest;
import com.example.pescAstur.controller.UserController;
import com.example.pescAstur.service.FirebaseUserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import java.io.IOException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.doThrow;


@SpringBootTest
@AutoConfigureMockMvc
public class FireBaseUserServiceTest {

    private FirebaseUserService userService;
    @Mock
    private FirebaseAuth firebaseAuth; // Simulamos FirebaseAuth

    @Autowired
    private MockMvc mockMvc;

    @InjectMocks
    private UserController userController; // Controlador a probar




    @BeforeEach
    public void setUp() throws IOException {
        userService = new FirebaseUserService();
        MockitoAnnotations.openMocks(this); // Inicializa los mocks

    }

    /**
     * Test que verifica el registro exitoso de un usuario en Firebase.
     * Simula la creación de un usuario y valida que el UID retornado sea el esperado.
     */
    @Test
    public void testRegisterUser() throws Exception {
        // Datos de prueba
        String email = "test@example.com";
        String password = "password123";
        String expectedUid = "test-uid";

        // Simular el comportamiento de FirebaseAuth usando un mock estático
        try (MockedStatic<FirebaseAuth> mockedFirebaseAuth = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth mockAuth = mock(FirebaseAuth.class);
            UserRecord mockUserRecord = mock(UserRecord.class);

            // Configurar el mock para retornar el UID esperado
            when(mockUserRecord.getUid()).thenReturn(expectedUid);
            when(mockAuth.createUser(any(UserRecord.CreateRequest.class))).thenReturn(mockUserRecord);

            // Configurar FirebaseAuth.getInstance() para que devuelva el mock
            mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(mockAuth);

            // Ejecutar el método registerUser
            String actualUid = userService.registerUser(email, password);

            // Verificación
            assertEquals(expectedUid, actualUid, "El UID del usuario registrado no coincide con el esperado.");
        }
    }
    /**
     * Prueba unitaria para verificar el comportamiento exitoso del método {@code updateUser}
     * de {@code userService}.
     * <p>Este test simula una actualización exitosa de un usuario utilizando un mock de
     * {@link FirebaseAuth}. Se espera que, al proporcionarle datos válidos, el método
     * {@code updateUser} retorne {@code true}, indicando que la actualización fue exitosa.</p>
     * <p>Configuración:
     * <ul>
     *     <li>Define datos de prueba, incluyendo el UID, email, contraseña, y estados
     *     de verificación de correo y de deshabilitación del usuario.</li>
     *     <li>Utiliza {@link MockedStatic} para simular el comportamiento de {@link FirebaseAuth#getInstance()}
     *     y retorna un mock de {@link FirebaseAuth}.</li>
     *     <li>Configura el mock de {@link FirebaseAuth} para retornar un {@link UserRecord}
     *     simulado en la llamada a {@code updateUser}, simulando una actualización exitosa.</li>
     * </ul>
     * </p>
     * @throws Exception si ocurre algún error en el proceso de actualización.
     */
    @Test
    public void testUpdateUserSuccess() throws Exception {
        // Datos de prueba
        String uid = "test-uid";
        String email = "test@example.com";
        String password = "securePassword123";
        boolean emailVerified = true;
        boolean disabled = false;

        // Simular el comportamiento de FirebaseAuth usando un mock estático
        try (MockedStatic<FirebaseAuth> mockedFirebaseAuth = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth mockAuth = mock(FirebaseAuth.class);
            UserRecord mockUserRecord = mock(UserRecord.class);

            // Configurar el mock para retornar el UserRecord esperado en el updateUser
            when(mockAuth.updateUser(any(UserRecord.UpdateRequest.class))).thenReturn(mockUserRecord);

            // Configurar FirebaseAuth.getInstance() para que devuelva el mock
            mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(mockAuth);

            // Ejecutar el método updateUser
            boolean result = userService.updateUser(uid, email, password, emailVerified, disabled);

            // Verificación
            assertTrue(result, "La actualización del usuario debería haber sido exitosa.");
        }
    }

    /**
     * Prueba unitaria para verificar el comportamiento del método {@code updateUser} cuando ocurre un fallo.
     * <p>Este test simula una excepción lanzada por Firebase al intentar actualizar un usuario. Se espera que,
     * cuando se produce un error durante la actualización del usuario, el método {@code updateUser} retorne
     * {@code false} como indicador de fallo.</p>
     * <p>Configuración:
     * <ul>
     *     <li>Utiliza {@link MockedStatic} para simular el comportamiento de {@link FirebaseAuth#getInstance()}
     *     y retorna un mock de {@link FirebaseAuth}.</li>
     *     <li>Configura el mock para lanzar una {@link RuntimeException} durante la actualización de usuario,
     *     simulando un error en el servicio de Firebase.</li>
     * </ul>
     * </p>
     * @throws RuntimeException si ocurre un error en el proceso de actualización del usuario.
     */
    @Test
    public void testUpdateUserFailure() throws FirebaseAuthException {
        // Datos de prueba
        String uid = "test-uid";
        String email = "test@example.com";
        String password = "securePassword123";
        boolean emailVerified = true;
        boolean disabled = false;

        // Simular el comportamiento de FirebaseAuth para lanzar una excepción
        try (MockedStatic<FirebaseAuth> mockedFirebaseAuth = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth mockAuth = mock(FirebaseAuth.class);

            // Configurar el mock para lanzar una RuntimeException en el updateUser
            when(mockAuth.updateUser(any(UserRecord.UpdateRequest.class)))
                    .thenThrow(new RuntimeException("Error de actualización"));

            // Configurar FirebaseAuth.getInstance() para que devuelva el mock
            mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(mockAuth);

            // Ejecutar el método updateUser
            boolean result = userService.updateUser(uid, email, password, emailVerified, disabled);

            // Verificación
            assertFalse(result, "La actualización del usuario debería haber fallado y devuelto false.");
        }
    }

    /**
     * Prueba unitaria para verificar el comportamiento exitoso del método {@code deleteUser}
     * de {@code FireBaseUserService}.
     * <p>Este test simula una eliminación exitosa de un usuario en Firebase usando un mock
     * de {@link FirebaseAuth}. Se espera que, al proporcionarle un UID válido, el método
     * {@code deleteUser} retorne {@code true}, indicando que la eliminación fue exitosa.</p>
     * <p>Configuración:
     * <ul>
     *     <li>Utiliza {@link MockedStatic} para simular el comportamiento de {@link FirebaseAuth#getInstance()}
     *     y retorna un mock de {@link FirebaseAuth}.</li>
     *     <li>Configura el mock para realizar una simulación exitosa de la eliminación del usuario
     *     al no lanzar ninguna excepción en la llamada a {@code deleteUser}.</li>
     * </ul>
     * </p>
     * @throws Exception si ocurre algún error en el proceso de eliminación.
     */
    @Test
    public void testDeleteUserSuccess() throws Exception {
        // UID de prueba
        String uid = "test-uid";

        // Simular el comportamiento de FirebaseAuth usando un mock estático
        try (MockedStatic<FirebaseAuth> mockedFirebaseAuth = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth mockAuth = mock(FirebaseAuth.class);

            // Configurar FirebaseAuth.getInstance() para que devuelva el mock
            mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(mockAuth);

            // Configurar el mock para simular una eliminación exitosa del usuario
            doNothing().when(mockAuth).deleteUser(uid);

            // Ejecutar el método deleteUser
            boolean result = userService.deleteUser(uid);

            // Verificación
            assertTrue(result, "La eliminación del usuario debería haber sido exitosa.");
        }
    }

    /**
     * Prueba unitaria para verificar el comportamiento de fallo del método {@code deleteUser}
     * de {@code FireBaseUserService}.
     * <p>Este test simula un error en la eliminación de un usuario en Firebase usando un mock
     * de {@link FirebaseAuth}. Se espera que, al ocurrir una excepción, el método {@code deleteUser}
     * retorne {@code false}, indicando que la eliminación no fue exitosa.</p>
     * <p>Configuración:
     * <ul>
     *     <li>Utiliza {@link MockedStatic} para simular el comportamiento de {@link FirebaseAuth#getInstance()}
     *     y retorna un mock de {@link FirebaseAuth}.</li>
     *     <li>Configura el mock para lanzar una {@code RuntimeException} en la llamada a {@code deleteUser}.</li>
     * </ul>
     * </p>
     */
    @Test
    public void testDeleteUserFailure() throws FirebaseAuthException {
        // UID de prueba
        String uid = "test-uid";

        // Simular el comportamiento de FirebaseAuth usando un mock estático
        try (MockedStatic<FirebaseAuth> mockedFirebaseAuth = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth mockAuth = mock(FirebaseAuth.class);

            // Configurar FirebaseAuth.getInstance() para que devuelva el mock
            mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(mockAuth);

            // Configurar el mock para lanzar una RuntimeException en la llamada a deleteUser
            doThrow(new RuntimeException("Error de eliminación")).when(mockAuth).deleteUser(uid);

            // Ejecutar el método deleteUser
            boolean result = userService.deleteUser(uid);

            // Verificación
            assertFalse(result, "La eliminación del usuario debería haber fallado.");
        }
    }

    /**
     * Prueba unitaria para verificar el comportamiento exitoso del método {@code getUserIdByEmail}
     * de {@code userService}.
     * <p>Este test simula la recuperación del UID de un usuario a través de su correo electrónico
     * utilizando un mock de {@link FirebaseAuth}. Se espera que el método retorne el UID correcto
     * cuando se proporciona un correo electrónico válido.</p>
     * <p>Configuración:
     * <ul>
     *     <li>Utiliza {@link MockedStatic} para simular el comportamiento de {@link FirebaseAuth#getInstance()}
     *     y retorna un mock de {@link FirebaseAuth}.</li>
     *     <li>Configura el mock para retornar un {@link UserRecord} con un UID esperado al llamar a {@code getUserByEmail}.</li>
     * </ul>
     * </p>
     */
    @Test
    public void testGetUserIdByEmailSuccess() throws FirebaseAuthException {
        // Correo electrónico de prueba
        String email = "test@example.com";
        String expectedUid = "test-uid";

        // Simular el comportamiento de FirebaseAuth usando un mock estático
        try (MockedStatic<FirebaseAuth> mockedFirebaseAuth = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth mockAuth = mock(FirebaseAuth.class);
            UserRecord mockUserRecord = mock(UserRecord.class);

            // Configurar FirebaseAuth.getInstance() para que devuelva el mock
            mockedFirebaseAuth.when(FirebaseAuth::getInstance).thenReturn(mockAuth);

            // Configurar el mock para retornar el UserRecord esperado
            when(mockAuth.getUserByEmail(email)).thenReturn(mockUserRecord);
            when(mockUserRecord.getUid()).thenReturn(expectedUid);

            // Ejecutar el método getUserIdByEmail
            String actualUid = userService.getUserIdByEmail(email);

            // Verificación
            assertEquals(expectedUid, actualUid, "El UID del usuario recuperado no coincide con el esperado.");
        }
    }

}
