package com.example.pescAstur.controllerIntegrationTest;
import com.example.pescAstur.model.Product;
import com.example.pescAstur.service.FirestoreService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Collections;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FirestoreService firestoreService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    /**
     * Test para verificar que el controlador obtiene todos los productos correctamente.
     * Este test verifica que el controlador devuelve el estado correcto y una lista de productos
     * que contiene los datos existentes en la base de datos.
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testGetAllProducts() throws Exception {
        // Act: Realiza la petición al controlador
        mockMvc.perform(get("/api/products/all")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    // Extraer la respuesta JSON y convertirla en una lista de productos
                    String jsonResponse = result.getResponse().getContentAsString();
                    List<Product> products = new ObjectMapper().readValue(jsonResponse,
                            new TypeReference<List<Product>>() {});

                    // Aquí puedes realizar las aserciones sobre los productos
                    // Por ejemplo, puedes verificar que no está vacío
                    assertFalse(products.isEmpty(), "La lista de productos no debe estar vacía");

                    // O verificar que contenga ciertos productos
                    assertTrue(products.stream().anyMatch(p -> p.getNombre().equals("Anzuelos Mustad Crystal Hook 275 BM")),
                            "La lista de productos debe contener Anzuelos Mustad Crystal Hook 275 BM");
                    assertTrue(products.stream().anyMatch(p -> p.getNombre().equals("Multifilamento Shimano Kairiki 4 300m")),
                            "La lista de productos debe contener 'Multifilamento Shimano Kairiki 4 300m'");
                });
    }

    /**
     * Test de integración para el método addStringToArrayField.
     * Este test verifica que se pueda añadir un comentario a un producto existente
     * y que se reciba una respuesta de éxito. Se realiza una llamada al endpoint
     * y se espera que el comentario se añada correctamente a Firestore.
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testAddCommentToProduct() throws Exception {
        // Arrange
        Product product = new Product();
        product.setUID("0K0TYoE9cAchpSqrYFXZ");
        product.setComentarios(Collections.singletonList("Este es un comentario de prueba."));

        // Act & Assert
        mockMvc.perform(patch("/api/products/addCommentToComments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"message\":\"Comment added successfully\"}"));

        Product updatedProduct = firestoreService.getProductByUID(product.getUID());
        assert updatedProduct.getComentarios().contains("Este es un comentario de prueba.");
    }

    /**
     * Prueba el método {@linkProductController#addRatingToArrayField(Product)}
     * para añadir una valoración a un producto.
     * Este método realiza una solicitud PATCH al endpoint correspondiente
     * para añadir una nueva valoración a un producto existente. Se espera que
     * la respuesta sea un estado HTTP 200 y un mensaje que confirme que la
     * valoración se ha añadido correctamente.
     * Después de realizar la solicitud, se verifica que la nueva valoración
     * ha sido añadida correctamente al producto en Firestore.
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testAddRatingToArrayField() throws Exception {
        // Crear un objeto Product con una nueva valoración para añadir
        Product productWithNewRating = new Product();
        productWithNewRating.setUID("0K0TYoE9cAchpSqrYFXZ");
        productWithNewRating.setRating(Collections.singletonList(4)); // Nueva valoración

        // Realizar la solicitud PATCH al endpoint
        mockMvc.perform(patch("/api/products/addRatingToRatings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productWithNewRating)))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"message\":\"Rating added successfully\"}"));

        // Verificar que la valoración se añadió correctamente
        Product updatedProduct = firestoreService.getProductByUID(productWithNewRating.getUID());
        assert updatedProduct.getRating().contains(4); // Comprobar que la nueva valoración está en la lista
    }

    /**
     * Prueba el método {@linkProductController#updateProductStocks(List<Product>)}
     * para actualizar el stock de los productos.
     * Este método realiza una solicitud POST al endpoint correspondiente
     * para actualizar el stock de los productos en Firestore. Se espera que
     * la respuesta sea un estado HTTP 200 y un mensaje que confirme que el
     * stock se ha actualizado correctamente.
     * Después de realizar la solicitud, se verifica que el stock de los productos
     * ha sido actualizado en Firestore.
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testUpdateProductStocks() throws Exception {
        // Crear una lista de productos con nuevos valores de stock
        List<Product> updatedProducts = new ArrayList<>();
        Product anzuelos=firestoreService.getProductByUID("0K0TYoE9cAchpSqrYFXZ");
        anzuelos.setCantidad(1);
        updatedProducts.add(anzuelos);
        for (Product product: updatedProducts){
            if(product.getUID()!=null){
                // Realizar la solicitud POST al endpoint
                mockMvc.perform(post("/api/products/update-stocks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updatedProducts)))
                        .andExpect(status().isOk())
                        .andExpect(content().string("Pedido procesado y stock actualizado correctamente para todos los productos"));
            }
        }
        // Verificar que el stock se actualizó correctamente
        for (Product product : updatedProducts) {
            Product updatedProduct = firestoreService.getProductByUID(anzuelos.getUID());
            assert updatedProduct.getCantidadStock() == product.getCantidadStock()-product.getCantidad(); // Comprobar que el stock ha sido actualizado
        }
    }
}
