package com.example.pescAstur.controller;

import com.example.pescAstur.model.Product;
import com.example.pescAstur.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/products")

public class ProductController {

    @Autowired
    private FirestoreService firestoreService;

    /**
     * Obtiene todos los productos almacenados en Firestore.
     * @return Lista de productos.
     * @throws ExecutionException
     * @throws InterruptedException
     */
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = firestoreService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /**
     *Añade un comentario a un producto en Firestore.
     * @param  product Producto al que se le añadirá el comentario.
     * @return Mensaje de confirmación.
     */
    @PatchMapping("/addCommentToComments")
    public ResponseEntity<Map<String,String>> addStringToArrayField(@RequestBody Product product) {
        try {
            firestoreService.addCommentToComments(product.getUID(), product.getComentarios().get(product.getComentarios().size() - 1));
            return ResponseEntity.ok(Map.of("message", "Comment added successfully"));
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error adding comment"));
        }
    }
    /**
     *Añade una valoración a un producto en Firestore.
     * @param  product Producto al que se le añadirá la valoración.
     * @return Mensaje de confirmación.
     */
    @PatchMapping("/addRatingToRatings")
    public ResponseEntity<Map<String,String>> addRatingToArrayField(@RequestBody Product product) {
        try {
            firestoreService.addRatingToRatings(product.getUID(), product.getRating().get(product.getRating().size() - 1));
            return ResponseEntity.ok(Map.of("message", "Rating added successfully"));
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error adding rating"));
        }
    }
    /**
     * Actualiza el stock de los productos en Firestore.
     * @param products Lista de productos con los nuevos valores de stock.
     * @return Mensaje de confirmación.
     */
    @PostMapping("/update-stocks")
    public ResponseEntity<String> updateProductStocks(@RequestBody List<Product> products) {
        try {
            String resultMessage = firestoreService.updateProductStocks(products);
            // Retorna el mensaje con el estado HTTP adecuado
            if (resultMessage.contains("Error")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultMessage);
            } else {
                return ResponseEntity.ok(resultMessage);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el pedido: " + e.getMessage());
        }
    }
}
