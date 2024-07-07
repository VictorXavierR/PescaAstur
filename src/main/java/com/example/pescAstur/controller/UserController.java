package com.example.pescAstur.controller;

import com.example.pescAstur.model.User;
import com.example.pescAstur.service.FirebaseUserService;
import com.example.pescAstur.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private FirebaseUserService firebaseUserService;

    @Autowired
    private FirestoreService firestoreService;

    /**
     * Registra un nuevo usuario en Firebase Authentication y guarda sus detalles en Firestore.
     * @param file Archivo de imagen de perfil del usuario.
     * @param userParams Mapa con los datos del usuario.
     * @return Mensaje de confirmación.
     * @throws IOException Si ocurre un error al procesar el archivo de imagen.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestParam("file") MultipartFile file, @RequestParam Map<String, String> userParams) throws IOException, ParseException {

        Map<String, String> response = new HashMap<>();
        // Crear un nuevo objeto User a partir de los parámetros recibidos
        User user = new User();
        user.setNombre(userParams.get("nombre"));
        user.setApellido(userParams.get("apellido"));
        user.setTelefono(userParams.get("telefono"));
        user.setDireccion(userParams.get("direccion"));
        user.setCiudad(userParams.get("ciudad"));
        user.setProvincia(userParams.get("provincia"));
        user.setCodigoPostal(userParams.get("codigoPostal"));
        user.setPais(userParams.get("pais"));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");//Formato de fecha
        user.setFechaNacimiento(sdf.parse(userParams.get("fechaNacimiento")));//Parsear la fecha
        user.setFechaRegistro(sdf.parse(userParams.get("fechaRegistro")));//Parsear la fecha
        user.setIdiomaPreferido(userParams.get("idiomaPreferido"));
        user.setEstadoCuenta(userParams.get("estadoCuenta"));
        user.setUserName(userParams.get("userName"));
        user.setDNI(userParams.get("DNI"));
        user.setFotoPerfil(file);  // Aquí se establece el MultipartFile directamente
        user.setEmail(userParams.get("email"));
        user.setPassword(userParams.get("password"));
        // Registrar el usuario en Firebase Authentication
        String userId = firebaseUserService.registerUser(user.getEmail(), user.getPassword());
        if (userId != null) {
            // Guardar detalles adicionales del usuario en Firestore
            firestoreService.saveUserDetails(userId, user);
            response.put("message", "Usuario registrado correctamente y detalles guardados en firestore.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Error al registrar el usuario.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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
