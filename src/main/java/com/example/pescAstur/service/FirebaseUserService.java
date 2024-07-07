package com.example.pescAstur.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class FirebaseUserService {
    /**
     * Registra un nuevo usuario en Firebase Authentication.
     * @param email Correo electrónico del usuario.
     * @param password Contraseña del usuario.
     * @return UID del usuario creado.
     */
    public String registerUser(String email, String password) {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setEmailVerified(false)
                .setDisabled(false);

        try {
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            return userRecord.getUid(); // Retorna el UID del usuario creado
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    /**
     * Actualiza los datos de un usuario en Firebase Authentication.
     * @param uid UID del usuario a actualizar.
     * @param email Nuevo correo electrónico del usuario.
     * @param password Nueva contraseña del usuario.
     * @param emailVerified Estado de verificación del correo electrónico.
     * @param disabled Estado de habilitación del usuario.
     * @return true si la actualización fue exitosa, false en caso contrario.
     */
    public boolean updateUser(String uid, String email, String password, boolean emailVerified, boolean disabled) {
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid)
                .setEmail(email)
                .setPassword(password)
                .setEmailVerified(emailVerified) // Actualizar estado de verificación del email
                .setDisabled(disabled); // Actualizar estado de habilitación

        try {
            UserRecord userRecord = FirebaseAuth.getInstance().updateUser(request);
            return userRecord != null;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     * Elimina un usuario de Firebase Authentication.
     * @param uid UID del usuario a eliminar.
     * @return true si la eliminación fue exitosa, false en caso contrario.
     */
    public boolean deleteUser(String uid) {
        try {
            FirebaseAuth.getInstance().deleteUser(uid);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Obtiene el UID de un usuario a partir de su correo electrónico.
     * @param email Correo electrónico del usuario.
     * @return UID del usuario.
     */
    public String getUserIdByEmail(String email) {
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
            return userRecord.getUid();
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Autentica un usuario en Firebase Authentication.
     * @param idToken Token de ID del usuario.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/authenticate")
    public String authenticateUser(@RequestBody String idToken) {
        try {
            // Verificar el token de ID con Firebase Authentication
            FirebaseAuth.getInstance().verifyIdToken(idToken);
            return "Autenticación exitosa";
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return "Error de autenticación";
        }
    }
}
