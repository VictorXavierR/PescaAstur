package com.example.pescAstur.serviceTest;
import com.example.pescAstur.service.FirebaseUserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import java.io.IOException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class FireBaseUserServiceTest {

    private FirebaseUserService userService;


    @BeforeEach
    public void setUp() throws IOException {
        userService = new FirebaseUserService();
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

}
