package com.example.pescAstur.service;

import com.example.pescAstur.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@DependsOn("initializeFirebase")
public class FirestoreService {
    private final Firestore db;

    public FirestoreService() {
        this.db = FirestoreClient.getFirestore(FirebaseApp.getInstance());
    }

    public void saveUserDetails(String userId, User user) {
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("nombre", user.getNombre());
        userDetails.put("apellido", user.getApellido());
        userDetails.put("telefono", user.getTelefono());
        userDetails.put("direccion", user.getDireccion());
        userDetails.put("ciudad", user.getCiudad());
        userDetails.put("provincia", user.getProvincia());
        userDetails.put("codigoPostal", user.getCodigoPostal());
        userDetails.put("pais", user.getPais());
        userDetails.put("fechaNacimiento", user.getFechaNacimiento());
        userDetails.put("fechaRegistro", user.getFechaRegistro());
        userDetails.put("idiomaPreferido", user.getIdiomaPreferido());
        userDetails.put("estadoCuenta", user.getEstadoCuenta());

        try {
            WriteResult result = db.collection("users").document(userId).set(userDetails).get();
            System.out.println("Write time : " + result.getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

}
