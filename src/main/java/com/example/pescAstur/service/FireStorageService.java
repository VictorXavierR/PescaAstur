package com.example.pescAstur.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.UUID;

public class FireStorageService {
    private final Storage storage;
    public FireStorageService() throws IOException {
        // Configura las credenciales del cliente de Google Cloud Storage
        this.storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(new FileInputStream("src/main/resources/pescaastur.json")))
                .build()
                .getService();
    }
    // Constructor para pruebas
    public FireStorageService(Storage storage) {
        this.storage = storage;
    }
    public boolean deleteFile(String fileName) {
        String bucketName = "pescaastur-160f4.appspot.com";
        BlobId blobId = BlobId.of(bucketName, fileName);
        System.out.println("Attempting to delete: " + fileName);
        boolean deleted= storage.delete(blobId);
        System.out.println("Delete result: " + deleted);
        return deleted;
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

        // Sube el archivo a Google Cloud Storage
        Bucket bucket = storage.get("pescaastur-160f4.appspot.com");
        Blob blob = bucket.create(fileName, fileContent, contentType);

        // Borra el archivo temporal después de subirlo
        if (!tempFile.delete()) {
            System.out.println("Failed to delete temporary file");
        }

        // Obtén la URL de descarga
        String downloadUrl = blob.getName();

        return downloadUrl;
    }

    /**
     * Convierte un MultipartFile a un archivo temporal.
     * @param file Archivo a convertir.
     * @return Archivo temporal.
     * @throws IOException Si ocurre un error al procesar el archivo.
     */
    public File convertToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
}
