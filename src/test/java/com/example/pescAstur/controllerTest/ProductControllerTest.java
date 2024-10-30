package com.example.pescAstur.controllerTest;

import com.example.pescAstur.controller.ProductController;
import com.example.pescAstur.model.Product;
import com.example.pescAstur.service.FirestoreService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FirestoreService firestoreService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test para verificar el comportamiento del controlador al obtener todos los productos de forma exitosa.
     * Este método simula una llamada al servicio de Firestore para recuperar una lista de productos.
     * Se crea una lista de productos de prueba con diferentes atributos y se espera que el controlador
     * responda con un estado HTTP 200 (OK) y que los datos devueltos coincidan con los productos simulados.
     * Se valida que la respuesta contenga las propiedades esperadas para cada producto,
     * como nombre, precio, categoría, cantidad en stock y UID.
     * @throws Exception si ocurre algún error durante la ejecución de la prueba.
     */
    @Test
    void testGetAllProducts_Success() throws Exception {
        // Arrange
        List<Integer> ratings = new ArrayList<>();
        ratings.add(1);
        List<String> comentarios = new ArrayList<>();
        comentarios.add("Prueba");

        Product product1 = new Product();
        product1.setNombre("Producto A");
        product1.setPrecio(100.0);
        product1.setCategoria("Electrónica");
        product1.setCantidadStock(50);
        product1.setDescripcion("Un producto de prueba de alta calidad");
        product1.setUID("UID001");
        product1.setCoste(10.0);
        product1.setDescuento(5.0);
        product1.setDimensiones("15x10x5 cm");
        product1.setFechaCreacion(LocalDate.now().toString());
        product1.setImagenURL("http://example.com/imageA.jpg");
        product1.setMarca("MarcaA");
        product1.setPeso("1.5");
        product1.setRating(ratings);
        product1.setComentarios(comentarios);

        Product product2 = new Product();
        product2.setNombre("Producto B");
        product2.setPrecio(200.0);
        product2.setCategoria("Hogar");
        product2.setCantidadStock(30);
        product2.setDescripcion("Otro producto de prueba para el hogar");
        product2.setUID("UID002");
        product2.setCoste(15.0);
        product2.setDescuento(10.0);
        product2.setDimensiones("20x15x10 cm");
        product2.setFechaCreacion(LocalDate.now().minusDays(1).toString());
        product2.setImagenURL("http://example.com/imageB.jpg");
        product2.setMarca("MarcaB");
        product2.setPeso("2.0");
        product2.setRating(ratings);
        product2.setComentarios(comentarios);

        List<Product> products = Arrays.asList(product1, product2);

        // Simulamos la respuesta del servicio
        when(firestoreService.getAllProducts()).thenReturn(products);

        // Act & Assert
        mockMvc.perform(get("/api/products/all")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Producto A"))
                .andExpect(jsonPath("$[0].precio").value(100.0))
                .andExpect(jsonPath("$[0].categoria").value("Electrónica"))
                .andExpect(jsonPath("$[0].cantidadStock").value(50))
                .andExpect(jsonPath("$[0].uid").value("UID001")) // Cambiado a "uid"
                .andExpect(jsonPath("$[1].nombre").value("Producto B"))
                .andExpect(jsonPath("$[1].precio").value(200.0))
                .andExpect(jsonPath("$[1].categoria").value("Hogar"))
                .andExpect(jsonPath("$[1].cantidadStock").value(30))
                .andExpect(jsonPath("$[1].uid").value("UID002")); // Cambiado a "uid"
    }

    /**
     * Test para verificar el comportamiento del controlador cuando se produce un error en el servidor
     * al intentar obtener todos los productos.
     * Este método simula una situación en la que el servicio de Firestore lanza una
     * {@link ExecutionException}. Se espera que, en esta situación, el controlador responda
     * con un estado HTTP 500 (Internal Server Error).
     * @throws Exception si ocurre algún error durante la ejecución de la prueba.
     */
    @Test
    void testGetAllProducts_ServerError() throws Exception {
        // Arrange: Simula que el método lanza una ExecutionException
        when(firestoreService.getAllProducts()).thenThrow(new ExecutionException("Firestore Error", new Throwable()));

        // Act & Assert
        mockMvc.perform(get("/api/products/all")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
    /**
     * Test para verificar que se puede añadir un comentario a un producto correctamente.
     * Este método simula una petición PATCH al endpoint '/api/products/addCommentToComments'.
     * Se espera que el comentario se añada correctamente y que se reciba un mensaje de éxito en la respuesta.
     * @throws Exception si ocurre algún error durante la ejecución de la prueba.
     */
    @Test
    void testAddCommentToComments_Success() throws Exception {
        // Arrange
        String productUID = "UID001";
        List<String> comentarios = new ArrayList<>();
        comentarios.add("Comentario inicial");

        Product product = new Product();
        product.setUID(productUID);
        product.setComentarios(comentarios);
        String newComment = "Nuevo comentario"; // Nuevo comentario a agregar
        product.getComentarios().add(newComment); // Agregamos el nuevo comentario a la lista

        // Simulamos la respuesta del servicio
        doReturn(null).when(firestoreService).addCommentToComments(eq(productUID), eq(newComment));

        // Act & Assert
        mockMvc.perform(patch("/api/products/addCommentToComments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Comment added successfully"));

        // Verificamos que el servicio fue llamado con los parámetros correctos
        verify(firestoreService).addCommentToComments(productUID, newComment);
    }

    /**
     * Test para verificar que se maneja correctamente un error al intentar añadir un comentario a un producto.
     * Este método simula una petición PATCH al endpoint '/api/products/addCommentToComments'.
     * Se espera que ocurra un error durante la adición del comentario, resultando en un estado de error
     * (500 Internal Server Error) en la respuesta.
     * @throws Exception si ocurre algún error durante la ejecución de la prueba.
     */
    @Test
    void testAddCommentToComments_Error() throws Exception {
        // Arrange
        String productUID = "UID001";
        List<String> comentarios = new ArrayList<>();
        comentarios.add("Comentario inicial");

        Product product = new Product();
        product.setUID(productUID);
        product.setComentarios(comentarios);
        String newComment = "Nuevo comentario"; // Nuevo comentario a agregar
        product.getComentarios().add(newComment); // Agregamos el nuevo comentario a la lista

        // Simulamos un error en el servicio
        doThrow(new ExecutionException("Error en Firestore", new Throwable())).when(firestoreService)
                .addCommentToComments(eq(productUID), eq(newComment));

        // Act & Assert
        mockMvc.perform(patch("/api/products/addCommentToComments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error adding comment"));

        // Verificamos que el servicio fue llamado con los parámetros correctos
        verify(firestoreService).addCommentToComments(productUID, newComment);
    }
    /**
     * Test para verificar el comportamiento del controlador al agregar una calificación
     * a la lista de calificaciones de un producto de forma exitosa.
     * Este método simula una solicitud PATCH al controlador con un producto que contiene
     * una calificación. Se espera que el controlador llame al servicio para agregar
     * esta calificación y responda con un estado HTTP 200 (OK) y un mensaje de éxito.
     * Se valida que el mensaje de respuesta sea "Rating added successfully",
     * indicando que la calificación se ha agregado correctamente.
     * @throws Exception si ocurre algún error durante la ejecución de la prueba.
     */
    @Test
    void testAddRatingToArrayField_Success() throws Exception {
        // Arrange
        Product product = new Product();
        product.setUID("UID001");
        List<Integer> ratings = new ArrayList<>();
        ratings.add(5); // Agregar una calificación de prueba
        product.setRating(ratings);

        // Simulamos que el servicio agrega la calificación correctamente y devuelve un mensaje
        when(firestoreService.addRatingToRatings(eq("UID001"), eq(5))).thenReturn("Rating added successfully");

        // Act & Assert
        mockMvc.perform(patch("/api/products/addRatingToRatings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Rating added successfully"));
    }
    /**
     * Prueba el método {@link ProductController#addRatingToArrayField(Product)} para un escenario en el que
     * ocurre un error al agregar una calificación. Esta prueba simula una {@link ExecutionException} lanzada
     * por el {@link FirestoreService} al intentar agregar una calificación a un producto.
     * <p>
     * La prueba prepara un objeto {@link Product} con un UID válido y una calificación, luego
     * se burla del {@link FirestoreService} para que lance una {@link ExecutionException} cuando
     * se llame. Se verifica que el estado de la respuesta sea HttpStatus#INTERNAL_SERVER_ERROR
     * y se comprueba que el cuerpo de la respuesta contenga el mensaje de error apropiado.
     * </p>
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testAddRatingToArrayField_Error() throws Exception {
        // Arrange
        Product product = new Product();
        product.setUID("UID001");
        List<Integer> ratings = new ArrayList<>();
        ratings.add(5); // Calificación de prueba
        product.setRating(ratings);

        // Simulamos que el servicio lanza una excepción al intentar agregar la calificación
        doThrow(new ExecutionException("Firestore Error", new Throwable()))
                .when(firestoreService).addRatingToRatings(eq("UID001"), eq(5));

        // Act & Assert
        mockMvc.perform(patch("/api/products/addRatingToRatings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(product)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Error adding rating"));
    }
    /**
     * Prueba el método {@link ProductController#updateProductStocks(List)} para un escenario exitoso donde
     * se actualizan correctamente los stocks de los productos.
     * <p>
     * La prueba crea una lista de objetos {@link Product} con información válida y simula que
     * el {@link FirestoreService} devuelve un mensaje de éxito al actualizar los stocks.
     * Se realiza una solicitud POST al endpoint correspondiente y se verifica que la respuesta
     * tenga un estado @link HttpStatus#OK y que el cuerpo de la respuesta contenga el mensaje de éxito esperado.
     * </p>
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testUpdateProductStocks_Success() throws Exception {
        // Arrange
        List<Product> products = new ArrayList<>();
        Product product1 = new Product();
        product1.setUID("UID001");
        product1.setCantidadStock(100);
        products.add(product1);

        Product product2 = new Product();
        product2.setUID("UID002");
        product2.setCantidadStock(200);
        products.add(product2);

        // Simulamos que el servicio devuelve un mensaje de éxito
        String successMessage = "Stocks actualizados correctamente";
        when(firestoreService.updateProductStocks(products)).thenReturn(successMessage);

        // Act & Assert
        mockMvc.perform(post("/api/products/update-stocks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(products)))
                .andExpect(status().isOk())
                .andExpect(content().string(successMessage));
    }
    /**
     * Prueba el método {@link ProductController#updateProductStocks(List)} para un escenario no exitoso
     * donde ocurre un error al actualizar los stocks de los productos.
     * <p>
     * La prueba crea una lista de objetos {@link Product} con información válida y simula que
     * el {@link FirestoreService} devuelve un mensaje de error al intentar actualizar los stocks.
     * Se realiza una solicitud POST al endpoint correspondiente y se verifica que la respuesta
     * tenga un estado @link HttpStatus#BAD_REQUEST y que el cuerpo de la respuesta contenga
     * el mensaje de error esperado.
     * </p>
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testUpdateProductStocks_Error() throws Exception {
        // Arrange
        List<Product> products = new ArrayList<>();
        Product product1 = new Product();
        product1.setUID("UID001");
        product1.setCantidadStock(100);
        products.add(product1);

        Product product2 = new Product();
        product2.setUID("UID002");
        product2.setCantidadStock(200);
        products.add(product2);

        // Simulamos que el servicio devuelve un mensaje de error
        String errorMessage = "Error al actualizar los stocks";
        when(firestoreService.updateProductStocks(anyList())).thenReturn(errorMessage);

        // Act & Assert
        mockMvc.perform(post("/api/products/update-stocks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(products)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(errorMessage));
    }

}
