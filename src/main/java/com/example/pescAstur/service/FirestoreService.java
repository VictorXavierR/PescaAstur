package com.example.pescAstur.service;

import com.example.pescAstur.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
@DependsOn("initializeFirebase")
public class FirestoreService {
    private final Firestore db;

    public FirestoreService() {
        this.db = FirestoreClient.getFirestore(FirebaseApp.getInstance());
    }

    /**
     * Guarda los detalles de un usuario en Firestore.
     * @param userId
     * @param user
     * @throws IOException
     */
    public void saveUserDetails(String userId, User user) throws IOException {
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
        userDetails.put("nombreUsuario", user.getUserName());
        userDetails.put("DNI", user.getDNI());
        userDetails.put("fotoPerfil", uploadProfilePhoto(user.getFotoPerfil(), userId));

        try {
            WriteResult result = db.collection("users").document(userId).set(userDetails).get();
            System.out.println("Write time : " + result.getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    /**
     * Actualiza los detalles de un usuario en Firestore.
     * @param userId
     * @param user
     * @throws IOException
     */
    public void updateUserDetails(String userId, User user) throws IOException {
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
        userDetails.put("nombreUsuario", user.getUserName());
        userDetails.put("DNI", user.getDNI());
        userDetails.put("fotoPerfil", uploadProfilePhoto(user.getFotoPerfil(), userId));


        try {
            WriteResult result = db.collection("users").document(userId).update(userDetails).get();
            System.out.println("Update time : " + result.getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    /**
     * Elimina los detalles de un usuario de Firestore.
     * @param userId
     */
    public void deleteUserDetails(String userId) {
        try {
            ApiFuture<WriteResult> writeResult = db.collection("users").document(userId).delete();
            System.out.println("Delete time : " + writeResult.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    /**
     * Sube una foto de perfil a Firebase Storage y devuelve la URL de descarga.
     * @param file
     * @param userId
     * @return URL de descarga de la foto de perfil.
     * @throws IOException
     */
    public String uploadProfilePhoto(MultipartFile file, String userId) throws IOException {
        // Genera un nombre de archivo único para evitar colisiones
        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();

        // Convierte MultipartFile a File temporal
        File tempFile = convertToFile(file);
        byte[] fileContent = Files.readAllBytes(tempFile.toPath());
        String contentType = Files.probeContentType(tempFile.toPath());

        // Sube el archivo a Firebase Storage
        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.create(fileName, fileContent, contentType);

        // Borra el archivo temporal después de subirlo
        tempFile.delete();

        // Obtén la URL de descarga
        String downloadUrl = generateDownloadUrl(blob);

        return downloadUrl;
    }

    /**
     * Convierte un MultipartFile a un archivo temporal.
     * @param file Archivo a convertir.
     * @return Archivo temporal.
     * @throws IOException Si ocurre un error al procesar el archivo.
     */
    private File convertToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    /**
     * Genera la URL de descarga de un archivo en Firebase Storage.
     * @param blob Archivo en Firebase Storage.
     * @return URL de descarga.
     */
    private String generateDownloadUrl(Blob blob) {
        return blob.getName();
    }

}
