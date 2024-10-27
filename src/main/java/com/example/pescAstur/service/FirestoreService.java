package com.example.pescAstur.service;

import com.example.pescAstur.model.Product;
import com.example.pescAstur.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
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
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@DependsOn("initializeFirebase")
public class FirestoreService {
    private final Firestore db;
    private final FireStorageService fireStorageService;

    public FirestoreService() throws IOException {
        this.fireStorageService = new FireStorageService();
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
        userDetails.put("fotoPerfil", this.fireStorageService.uploadProfilePhoto(user.getFotoPerfil(), userId));

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
        String blobName = getProfilePhoto(userId);
        if(blobName!=null){
            if(user.getFotoPerfil()!=null){
                this.fireStorageService.deleteFile(blobName);
                userDetails.put("fotoPerfil", this.fireStorageService.uploadProfilePhoto(user.getFotoPerfil(), userId));
            }else{
                userDetails.put("fotoPerfil", blobName);
            }
        }
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
     * Obtiene la url de la foto de perfil de un usuario a partir de su ID.
     * @param userId
     * @return URL de la foto de perfil.
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String getProfilePhoto(String userId) {
        try {
            DocumentReference docRef = db.collection("users").document(userId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return document.getString("fotoPerfil");
            } else {
                System.out.println("No such document!");
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Obtiene los productos de la base de datos products en Firestore.
     * @return Lista de productos.
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public List<Product> getAllProducts() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection("products").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Product> products = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            Product product = document.toObject(Product.class);
            product.setUID(document.getId()); // Asigna el UID del documento al producto
            products.add(product);
        }
        return products;
    }

    /**
     * Obtiene la foto de un producto a partir de su ID.
     * @param productId
     * @return URL de la foto del producto.
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String getProductPhoto(String productId) {
        try {
            DocumentReference docRef = db.collection("products").document(productId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return document.getString("imagenURL");
            } else {
                System.out.println("No such document!");
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Añade un comentario a un documento en Firestore.
     * @param documentId
     * @param comment
     * @return Fecha de actualización.
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String addCommentToComments(String documentId,String comment) throws ExecutionException, InterruptedException {
        WriteResult writeResult = db.collection("products").document(documentId)
                .update("comentarios", FieldValue.arrayUnion(comment)).get();
        return writeResult.getUpdateTime().toString();
    }

    /**
     * Añade una valoracion a un documento en Firestore.
     * @param documentId
     * @param rating
     * @return Fecha de actualización.
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String addRatingToRatings(String documentId,int rating) throws ExecutionException, InterruptedException {
        WriteResult writeResult = db.collection("products").document(documentId)
                .update("rating", FieldValue.arrayUnion(rating)).get();
        return writeResult.getUpdateTime().toString();
    }
    /**
     * Actualiza el stock de productos en Firestore.
     * @param products Lista de productos con la cantidad de stock a actualizar.
     * @return Mensaje de confirmación.
     */
    public String updateProductStocks(List<Product> products) {
        try {
            for (Product product : products) {
                DocumentReference docRef = db.collection("products").document(product.getUID());
                DocumentSnapshot document = docRef.get().get();

                if (document.exists()) {
                    // Asegúrate de que el campo cantidadStock sea un número
                    Long cantidadStockObj = document.getLong("cantidadStock");
                    if (cantidadStockObj == null) {
                        return "Error: El stock para el producto con ID " + product.getUID() + " no está disponible.";
                    }

                    int currentStock = cantidadStockObj.intValue();
                    int requestedQuantity = product.getCantidad();

                    // Verifica que haya suficiente stock
                    if (currentStock >= requestedQuantity) {
                        // Resta el stock
                        int newStock = currentStock - requestedQuantity;

                        // Actualiza el stock en Firestore
                        WriteResult writeResult = docRef.update("cantidadStock", newStock).get();
                    } else {
                        // Si no hay suficiente stock, retorna un mensaje de error
                        return "Error: Stock insuficiente para el producto con ID " + product.getUID();
                    }
                } else {
                    return "Error: Producto con ID " + product.getUID() + " no encontrado en la base de datos";
                }
            }
            // Si todos los productos se actualizan correctamente, devuelve éxito
            return "Pedido procesado y stock actualizado correctamente para todos los productos";
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error al procesar el pedido: " + e.getMessage();
        }
    }

}
