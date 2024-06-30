package com.example.pescAstur.controller;

import com.example.pescAstur.model.User;
import com.example.pescAstur.service.FirebaseUserService;
import com.example.pescAstur.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {
    @Autowired
    private FirebaseUserService firebaseUserService;

    @Autowired
    private FirestoreService firestoreService;

    /**
     * Registra un nuevo usuario en Firebase Authentication y guarda sus detalles en Firestore.
     * @param user Datos del usuario a registrar.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        // Registrar el usuario en Firebase Authentication
        String userId = firebaseUserService.registerUser(user.getEmail(), user.getPassword());
        if (userId != null) {
            // Guardar detalles adicionales del usuario en Firestore
            firestoreService.saveUserDetails(userId, user);
            return "Usuario registrado y detalles guardados en Firestore.";
        } else {
            return "Error al registrar el usuario.";
        }
    }

    /**
     * Actualiza los datos de autenticación de un usuario en Firebase Authentication.
     * @param users Mapa con los datos del usuario nuevo y antiguo.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/update-auth")
    public String updateUserAuth(@RequestBody Map<String, User> users) {
        User newUser = users.get("newUser");
        User oldUser = users.get("oldUser");

        if (newUser == null || oldUser == null) {
            return "Error: Los datos de usuario son nulos.";
        }

        String userId = firebaseUserService.getUserIdByEmail(oldUser.getEmail());
        boolean updated = firebaseUserService.updateUser(userId, newUser.getEmail(), newUser.getPassword(), false, false);

        if (updated) {
            return "Datos de autenticación actualizados.";
        } else {
            return "Error al actualizar los datos de autenticación.";
        }
    }


    /**
     * Actualiza los detalles de un usuario en Firestore.
     * @param user Datos del usuario a actualizar.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/update-details")
    public String updateUserDetails(@RequestBody User user) {
        try {
            String userId=firebaseUserService.getUserIdByEmail(user.getEmail());
            firestoreService.updateUserDetails(userId, user);
            return "Detalles del usuario actualizados.";
        } catch (Exception e) {
            return "Error al actualizar los detalles del usuario.";
        }
    }

    /**
     * Elimina un usuario de Firebase Authentication y Firestore.
     * @param userDeleteRequest usuario a eliminar.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/delete")
    public String deleteUser(@RequestBody User userDeleteRequest) {
        String uid = firebaseUserService.getUserIdByEmail(userDeleteRequest.getEmail());
        boolean deleted = firebaseUserService.deleteUser(uid);
        if (deleted) {
            firestoreService.deleteUserDetails(uid);
            return "Usuario eliminado.";
        } else {
            return "Error al eliminar el usuario.";
        }
    }
}
