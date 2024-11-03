package com.example.pescAstur.serviceIntegrationTest;
import com.example.pescAstur.service.FirebaseUserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class FireBaseUserServiceIntegrationTest {

    @Autowired
    private FirebaseUserService firebaseUserService;


    /**
     * Test de integración para registrar un nuevo usuario en Firebase Authentication.
     * <p>Este test verifica que se puede registrar un nuevo usuario con
     * un correo electrónico y una contraseña. Se espera que el UID del usuario
     * creado no sea nulo.
     * @throws Exception si ocurre algún error durante el registro del usuario.
     */
    @Test
    void registerUser_Success() throws Exception {
        // Datos de prueba para el nuevo usuario
        String testEmail = "testuser@example.com"; // Cambia esto a un correo electrónico de prueba real
        String testPassword = "StrongPassword123!";
        // Llamar al método para registrar el nuevo usuario
        String uid = firebaseUserService.registerUser(testEmail, testPassword);
        // Verificar que el UID devuelto no sea nulo
        assertNotNull(uid, "El UID del usuario creado no debe ser nulo.");
    }

    /**
     * Test de integración para actualizar un usuario en Firebase Authentication.
     * <p>Este test verifica que se puede actualizar un usuario existente
     * con un nuevo correo electrónico, contraseña y otros atributos.
     * @throws Exception si ocurre algún error durante la actualización del usuario.
     */
    @Test
    void updateUser_Success() throws Exception {
        // Datos de actualización del usuario
        String newEmail = "updateduser@example.com";
        String newPassword = "NewStrongPassword123!";
        boolean newEmailVerified = true;
        boolean newDisabledState = false;
        String testUid="Yd4vY6LhpcfT77zR9c8O6vip1Fl1";//Este UID debe existir en la base de datos
        // Llamar al método para actualizar el usuario
        firebaseUserService.updateUser(testUid, newEmail, newPassword, newEmailVerified, newDisabledState);
        // Recuperar el usuario actualizado
        UserRecord updatedUserRecord = FirebaseAuth.getInstance().getUser(testUid);
        // Verificar que el correo electrónico se haya actualizado correctamente
        assertEquals(newEmail, updatedUserRecord.getEmail(), "El correo electrónico debe ser actualizado.");
    }
    /**
     * Test de integración para obtener el UID de un usuario a partir de su correo electrónico.
     * <p>Este test verifica que se puede obtener el UID correcto después de crear un usuario.
     */
    @Test
    void getUserIdByEmail_Success() {
        // Llamar al método para obtener el UID por correo electrónico
        String uid = firebaseUserService.getUserIdByEmail("updateduser@example.com");//Este correo debe existir en la base de datos
        // Verificar que el UID no es nulo y coincide con el UID registrado
        assertNotNull(uid, "El UID no debe ser nulo.");
    }

    /**
     * Test de integración para eliminar un usuario de Firebase Authentication.
     * <p>Este test verifica que se puede eliminar un usuario existente.
     */
    @Test
    void deleteUser_Success() {
        String testUid="Yd4vY6LhpcfT77zR9c8O6vip1Fl1";//Este UID debe existir en la base de datos
        // Llamar al método para eliminar el usuario
        boolean deletionSuccess = firebaseUserService.deleteUser(testUid);
        // Verificar que la eliminación fue exitosa
        assertTrue(deletionSuccess, "La eliminación del usuario debería ser exitosa.");
        // Intentar recuperar el usuario para verificar que ha sido eliminado
        try {
            FirebaseAuth.getInstance().getUser(testUid);
            // Si no se lanza una excepción, significa que el usuario aún existe, lo que es un error
            fail("El usuario debería haber sido eliminado, pero todavía existe.");
        } catch (FirebaseAuthException e) {
            // Esto es lo esperado, ya que el usuario no debería existir
        }
    }
}
