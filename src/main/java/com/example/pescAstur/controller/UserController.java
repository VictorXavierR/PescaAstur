package com.example.pescAstur.controller;

import com.example.pescAstur.model.User;
import com.example.pescAstur.service.FirebaseUserService;
import com.example.pescAstur.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {
    @Autowired
    private FirebaseUserService firebaseUserService;

    @Autowired
    private FirestoreService firestoreService;

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
}
