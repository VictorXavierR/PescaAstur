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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private FirebaseUserService firebaseUserService;

    @Autowired
    private FirestoreService firestoreService;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    /**
     * Registra un nuevo usuario en Firebase Authentication y guarda sus detalles en Firestore.
     * @param file Archivo de imagen de perfil del usuario.
     * @param userParams Mapa con los datos del usuario.
     * @return Mensaje de confirmación.
     * @throws IOException Si ocurre un error al procesar el archivo de imagen.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestParam("file") MultipartFile file,
            @RequestParam Map<String, String> userParams) {

        Map<String, String> response = new HashMap<>();
        try {
            // Logging para inspeccionar los parámetros recibidos
            logger.info("Recibiendo solicitud de registro con los siguientes parámetros: " + userParams);
            logger.info("Nombre del archivo recibido: " + (file != null ? file.getOriginalFilename() : "No se recibió archivo"));

            // Validaciones básicas
            if (userParams.get("email") == null || userParams.get("email").isEmpty()) {
                response.put("message", "El email es obligatorio.");
                return ResponseEntity.badRequest().body(response);
            }
            if (file == null || file.isEmpty()) {
                response.put("message", "La imagen de perfil es obligatoria.");
                return ResponseEntity.badRequest().body(response);
            }

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

            // Formato de fecha: validar si la fecha es correcta
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            try {
                user.setFechaNacimiento(sdf.parse(userParams.get("fechaNacimiento")));
                user.setFechaRegistro(new Date()); // Fecha de registro se establece en el momento actual
            } catch (ParseException e) {
                logger.error("Error al parsear las fechas de nacimiento o registro", e);
                response.put("message", "Formato de fecha incorrecto.");
                return ResponseEntity.badRequest().body(response);
            }

            user.setIdiomaPreferido(userParams.get("idiomaPreferido"));
            user.setEstadoCuenta(userParams.get("estadoCuenta"));
            user.setUserName(userParams.get("userName"));
            user.setDNI(userParams.get("DNI"));
            user.setFotoPerfil(file);  // Establecer archivo de foto de perfil
            user.setEmail(userParams.get("email"));
            user.setPassword(userParams.get("password"));

            // Logging para Firebase
            logger.info("Intentando registrar usuario en Firebase con email: " + user.getEmail());

            // Registrar el usuario en Firebase Authentication
            String userId = firebaseUserService.registerUser(user.getEmail(), user.getPassword());
            if (userId == null) {
                response.put("message", "Error al registrar el usuario en Firebase.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            // Guardar detalles adicionales del usuario en Firestore
            logger.info("Guardando detalles adicionales en Firestore para el usuario: " + userId);
            firestoreService.saveUserDetails(userId, user);

            // Respuesta exitosa
            response.put("message", "Usuario registrado correctamente y detalles guardados en Firestore.");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            logger.error("Error al procesar el archivo", e);
            response.put("message", "Error al procesar el archivo.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            // Captura cualquier otro error inesperado y lo loguea
            logger.error("Error inesperado al registrar el usuario", e);
            response.put("message", "Error inesperado: " + e.getMessage());
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
     * @param fotoPerfil Archivo de imagen de perfil del usuario.
     * @param userParams Mapa con los datos del usuario.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/update-details")
    public ResponseEntity<String> updateUserDetails(@RequestParam(required = false) MultipartFile fotoPerfil,
                                                    @RequestParam Map<String, String> userParams) {
        try {
            // Construir el objeto User con los parámetros recibidos
            User user = new User();
            user.setUserName(userParams.get("userName"));
            user.setEmail(userParams.get("email"));
            user.setDNI(userParams.get("DNI"));
            user.setTelefono(userParams.get("telefono"));
            user.setDireccion(userParams.get("direccion"));
            user.setCiudad(userParams.get("ciudad"));
            user.setProvincia(userParams.get("provincia"));
            user.setCodigoPostal(userParams.get("codigoPostal"));
            user.setPais(userParams.get("pais"));
            user.setFechaRegistro(new SimpleDateFormat("dd-MM-yyyy").parse(userParams.get("fechaRegistro")));
            user.setEstadoCuenta(userParams.get("estadoCuenta"));
            user.setIdiomaPreferido(userParams.get("idiomaPreferido"));
            if(fotoPerfil!=null){
                user.setFotoPerfil(fotoPerfil);
            }else{
                user.setFotoPerfil(null);
            }
            user.setNombre(userParams.get("nombre"));
            user.setFechaNacimiento(new SimpleDateFormat("dd-MM-yyyy").parse(userParams.get("fechaNacimiento")));
            user.setApellido(userParams.get("apellido"));

            // Actualizar los detalles del usuario en la base de datos
            String userId = firebaseUserService.getUserIdByEmail(user.getEmail());
            firestoreService.updateUserDetails(userId, user);

            return ResponseEntity.ok("Detalles del usuario actualizados correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar los detalles del usuario: " + e.getMessage());
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
