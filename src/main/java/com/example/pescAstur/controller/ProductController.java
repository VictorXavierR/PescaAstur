package com.example.pescAstur.controller;

import com.example.pescAstur.model.Product;
import com.example.pescAstur.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
