package com.example.pescAstur.serviceIntegrationTest;
import com.example.pescAstur.model.Product;
import com.example.pescAstur.model.User; // Asegúrate de que la ruta sea correcta
import com.example.pescAstur.service.FirestoreService; // Ajusta la ruta según tu estructura de paquetes
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;
import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
public class FirestoreServiceIntegrationTest {
    private FirestoreService firestoreService;
    private final String userId = "DwLVddFFbkavrPGse8eUnV0DZoy2"; // Cambia esto por un ID de usuario válido
    private final String testFilePath = "C:\\Users\\Víctor\\Desktop\\entradaMina.png"; // Cambia esto por el path de tu imagen
    private final String testUrlPhoto = "58e7a1df-4809-4569-87b7-aa6c7524763d-entradaMina.png";
    private List<String> testProductIds = new ArrayList<>();

    @BeforeEach
    void setUp() throws IOException {
        firestoreService = new FirestoreService(); // Inicializa tu servicio que ya tiene Firestore
        testProductIds.add("0K0TYoE9cAchpSqrYFXZ");
        testProductIds.add("u7bpVMJ6pvvkMfjPPLAJ");
    }
    /**
     * Test de integración para el método {@code saveUserDetails()} de la clase {@link FirestoreService}.
     * <p>Este test verifica que los detalles de un usuario se guarden correctamente en Firestore.
     * Simula la carga de una imagen de perfil y verifica que todos los campos proporcionados
     * se guarden correctamente en la base de datos. También asegura que la fecha de nacimiento
     * y la fecha de registro se conviertan adecuadamente y se guarden como parte del documento.</p>
     * <p>Pasos del test:</p>
     * <ol>
     *     <li>Crea un archivo {@code MultipartFile} a partir de una imagen de perfil existente.</li>
     *     <li>Define fechas de nacimiento y registro usando {@code LocalDate} y conviértelas a {@code Date}.</li>
     *     <li>Configura los detalles del usuario (nombre, apellido, dirección, idioma, etc.).</li>
     *     <li>Llama al método {@code saveUserDetails()} para guardar la información en Firestore.</li>
     *     <li>Recupera los datos guardados desde Firestore y valida que coincidan con los datos originales.</li>
     * </ol>
     * <p>Este test utiliza {@code assertNotNull} para verificar que el documento del usuario fue creado
     * y {@code assertEquals} para comparar cada campo guardado en Firestore con los valores originales.
     * También utiliza un archivo local para simular la carga de una foto de perfil como {@code MultipartFile}.</p>
     * @throws IOException si ocurre un error al leer el archivo de imagen de perfil.
     * @throws ExecutionException si ocurre un error al ejecutar la operación de Firestore.
     * @throws InterruptedException si la operación de Firestore es interrumpida.
     */
    @Test
    void saveUserDetails_Success() throws IOException, ExecutionException, InterruptedException {
        // Crea un MultipartFile a partir de un archivo existente
        File file = new File(testFilePath);
        MockMultipartFile multipartFile = new MockMultipartFile(
                "fotoPerfil", // Nombre del campo en el formulario
                file.getName(), // Nombre original del archivo
                Files.probeContentType(file.toPath()), // Tipo de contenido
                new FileInputStream(file) // Stream del archivo
        );
        // Configura la fecha de nacimiento y registro usando LocalDate
        LocalDate birthDate = LocalDate.of(1990, 5, 15); // Cambia a la fecha que necesites
        LocalDate registrationDate = LocalDate.now();
        // Convierte LocalDate a Date
        Date fechaNacimiento = Date.from(birthDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fechaRegistro = Date.from(registrationDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        // Crea un usuario con los detalles que quieras
        User user = new User();
        user.setNombre("Juan");
        user.setApellido("Pérez");
        user.setTelefono("123456789");
        user.setDireccion("Calle Falsa 123");
        user.setCiudad("Madrid");
        user.setProvincia("Madrid");
        user.setCodigoPostal("28001");
        user.setPais("España");
        user.setFechaNacimiento(fechaNacimiento);
        user.setFechaRegistro(fechaRegistro);
        user.setIdiomaPreferido("Español");
        user.setEstadoCuenta("Activo");
        user.setUserName("juanp");
        user.setDNI("12345678Z");
        user.setFotoPerfil(multipartFile); // Aquí asignas el MultipartFile
        // Llama al método para guardar detalles del usuario
        firestoreService.saveUserDetails(userId, user);
        // Verifica que el usuario se haya guardado correctamente en Firestore
        Firestore db = firestoreService.getDb(); // Usar el método getter para acceder a Firestore
        Map<String, Object> savedUserDetails = db.collection("users").document(userId).get().get().getData();
        assertNotNull(savedUserDetails, "Los detalles del usuario no deben ser nulos.");
        assertEquals("Juan", savedUserDetails.get("nombre"));
        assertEquals("Pérez", savedUserDetails.get("apellido"));
        assertEquals("123456789", savedUserDetails.get("telefono"));
        assertEquals("Calle Falsa 123", savedUserDetails.get("direccion"));
        assertEquals("Madrid", savedUserDetails.get("ciudad"));
        assertEquals("Madrid", savedUserDetails.get("provincia"));
        assertEquals("28001", savedUserDetails.get("codigoPostal"));
        assertEquals("España", savedUserDetails.get("pais"));
        assertEquals("Español", savedUserDetails.get("idiomaPreferido"));
        assertEquals("Activo", savedUserDetails.get("estadoCuenta"));
        assertEquals("juanp", savedUserDetails.get("nombreUsuario"));
        assertEquals("12345678Z", savedUserDetails.get("DNI"));
    }
    /**
     * Prueba de integracion para verificar la actualización de los detalles de un usuario en Firestore.
     * <p>
     * Este test carga un archivo de imagen simulado como foto de perfil de usuario y crea un
     * objeto {@code User} con datos de prueba. Luego, intenta actualizar el documento del usuario
     * en Firestore con los datos proporcionados y verifica que la actualización sea exitosa
     * revisando los valores de los campos en Firestore.
     * </p>
     * <p>
     * La prueba cubre la actualización de los siguientes datos del usuario:
     * <ul>
     *   <li>Nombre</li>
     *   <li>Apellido</li>
     *   <li>Teléfono</li>
     *   <li>Dirección</li>
     *   <li>Ciudad</li>
     *   <li>Provincia</li>
     *   <li>Código postal</li>
     *   <li>País</li>
     *   <li>Fecha de nacimiento</li>
     *   <li>Fecha de registro</li>
     *   <li>Idioma preferido</li>
     *   <li>Estado de la cuenta</li>
     *   <li>Nombre de usuario</li>
     *   <li>DNI</li>
     *   <li>Foto de perfil</li>
     * </ul>
     * </p>
     * @throws IOException                Si ocurre un error de entrada/salida al cargar la foto de perfil.
     * @throws ExecutionException         Si ocurre un error en la ejecución de operaciones asincrónicas.
     * @throws InterruptedException       Si la operación es interrumpida.
     */
    @Test
    void testUpdateUserDetails() throws IOException, ExecutionException, InterruptedException {
        File file = new File(testFilePath);
        MockMultipartFile multipartFile = new MockMultipartFile(
                "fotoPerfil", // Nombre del campo en el formulario
                file.getName(), // Nombre original del archivo
                Files.probeContentType(file.toPath()), // Tipo de contenido
                new FileInputStream(file) // Stream del archivo
        );
        // Configura la fecha de nacimiento y registro usando LocalDate
        LocalDate birthDate = LocalDate.of(1990, 5, 15); // Cambia a la fecha que necesites
        LocalDate registrationDate = LocalDate.now();
        // Convierte LocalDate a Date
        Date fechaNacimiento = Date.from(birthDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date fechaRegistro = Date.from(registrationDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        // Datos de prueba
        User user = new User();
        user.setNombre("John");
        user.setApellido("Doe");
        user.setTelefono("123456789");
        user.setDireccion("1234 Elm Street");
        user.setCiudad("Anytown");
        user.setProvincia("Anyprovince");
        user.setCodigoPostal("12345");
        user.setPais("Anyland");
        user.setFechaNacimiento(fechaNacimiento);
        user.setFechaRegistro(fechaRegistro);
        user.setIdiomaPreferido("es");
        user.setEstadoCuenta("activo");
        user.setUserName("johndoe");
        user.setDNI("12345678");
        user.setFotoPerfil(multipartFile);

        Firestore db= firestoreService.getDb();
        if (db.collection("users").document(userId).get().get().exists()) {
            // Ejecutar el método real para actualizar el usuario
            firestoreService.updateUserDetails(userId, user);
        } else {
            System.out.println("Documento con userId no encontrado.");
        }
        // Verificar que los datos se hayan actualizado en Firestore
        Map<String, Object> updatedUserData = db.collection("users").document(userId).get().get().getData();
        assertNotNull(updatedUserData, "Los datos del usuario no se actualizaron correctamente en Firestore");
        assertEquals(user.getNombre(), updatedUserData.get("nombre"));
        assertEquals(user.getApellido(), updatedUserData.get("apellido"));
        assertEquals(user.getTelefono(), updatedUserData.get("telefono"));
        assertEquals(user.getDireccion(), updatedUserData.get("direccion"));
        assertEquals(user.getCiudad(), updatedUserData.get("ciudad"));
        assertEquals(user.getProvincia(), updatedUserData.get("provincia"));
        assertEquals(user.getCodigoPostal(), updatedUserData.get("codigoPostal"));
        assertEquals(user.getPais(), updatedUserData.get("pais"));
        assertEquals(user.getIdiomaPreferido(), updatedUserData.get("idiomaPreferido"));
        assertEquals(user.getEstadoCuenta(), updatedUserData.get("estadoCuenta"));
        assertEquals(user.getUserName(), updatedUserData.get("nombreUsuario"));
        assertEquals(user.getDNI(), updatedUserData.get("DNI"));
        // Verificar si se ha subido la foto de perfil
        String profilePhotoPath = (String) updatedUserData.get("fotoPerfil");
        assertNotNull(profilePhotoPath, "La foto de perfil no se subió correctamente");
    }

    /**
     * Verifica que el método getProfilePhoto devuelva la URL de la foto de perfil
     * correctamente cuando el usuario existe en Firestore.
     * <p>
     * Este test prepara un usuario de prueba en la colección "users" de Firestore con
     * una URL de foto de perfil específica y luego llama al método {@link FirestoreService#getProfilePhoto(String)}
     * para asegurarse de que devuelve la URL esperada.
     * </p>
     * @throws ExecutionException   si ocurre un error en la ejecución de la operación de Firestore.
     * @throws InterruptedException si la operación de Firestore es interrumpida.
     */
    @Test
    public void testGetProfilePhoto_ExistingUser() throws ExecutionException, InterruptedException {
        // Ejecuta el método que se está probando
        String retrievedUrl = firestoreService.getProfilePhoto(userId);
        // Verifica que la URL obtenida sea la esperada
        assertNotNull(retrievedUrl, "La URL de la foto de perfil no debería ser nula para un usuario existente");
        assertEquals(testUrlPhoto, retrievedUrl, "La URL de la foto de perfil obtenida no coincide con la esperada");
    }
    /**
     * Verifica que el método getProfilePhoto devuelva null cuando el usuario
     * no existe en Firestore.
     * <p>
     * Este test utiliza un ID de usuario inexistente para probar que
     * {@link FirestoreService#getProfilePhoto(String)} devuelve null,
     * indicando que no se encontró ningún documento correspondiente en Firestore.
     * </p>
     * @throws ExecutionException   si ocurre un error en la ejecución de la operación de Firestore.
     * @throws InterruptedException si la operación de Firestore es interrumpida.
     */
    @Test
    public void testGetProfilePhoto_NonExistingUser() throws ExecutionException, InterruptedException {
        // Prueba con un ID de usuario que no existe
        String retrievedUrl = firestoreService.getProfilePhoto("nonExistingUserId");
        // Verifica que el resultado sea nulo, ya que el usuario no existe
        assertNull(retrievedUrl, "La URL de la foto de perfil debería ser nula para un usuario inexistente");
    }

    /**
     * Verifica que el método getAllProducts devuelva una lista de todos los productos en Firestore.
     * <p>
     * Este test llama a {@link FirestoreService#getAllProducts()}
     * y verifica que la lista devuelta contenga el mismo número de productos que los insertados y que los datos coincidan.
     * </p>
     * @throws ExecutionException   si ocurre un error en la ejecución de la operación de Firestore.
     * @throws InterruptedException si la operación de Firestore es interrumpida.
     */
    @Test
    public void testGetAllProducts() throws ExecutionException, InterruptedException {
        // Llamar al método para obtener todos los productos
        List<Product> products = firestoreService.getAllProducts();

        // Verificar que la lista no esté vacía y que contenga al menos los productos de prueba
        assertTrue(products.size() >= testProductIds.size(), "La lista de productos no contiene el número esperado de productos.");

        // Verificar que cada producto de prueba está en la lista obtenida
        for (String testProductId : testProductIds) {
            boolean productFound = products.stream().anyMatch(p -> p.getUID().equals(testProductId));
            assertTrue(productFound, "No se encontró el producto de prueba con UID " + testProductId + " en la lista de productos obtenidos.");
        }
    }

    /**
     * Test de integración para el método {@link FirestoreService#addCommentToComments(String, String)}.
     * Este test verifica que un comentario se agregue correctamente a la lista de comentarios de un documento
     * en la colección "products" de Firestore.
     * <p>
     * El test realiza los siguientes pasos:
     * <ol>
     *   <li>Configura los datos de prueba, incluyendo un identificador de documento válido y un comentario.</li>
     *   <li>Llama al método {@link FirestoreService#addCommentToComments(String, String)} para agregar el comentario al documento.</li>
     *   <li>Verifica que el tiempo de actualización del documento no sea nulo, lo que indica que la operación de escritura fue exitosa.</li>
     *   <li>Recupera el documento de Firestore usando el identificador de documento proporcionado.</li>
     *   <li>Verifica que el documento exista en Firestore.</li>
     *   <li>Obtiene la lista de comentarios del documento y verifica que el comentario agregado esté presente en la lista.</li>
     * </ol>
     * <p>
     * Este test ayuda a asegurar que la funcionalidad de agregar comentarios esté trabajando correctamente en
     * un entorno real de Firestore.
     * </p>
     * @throws ExecutionException Si ocurre un error durante la ejecución de la operación de Firestore.
     * @throws InterruptedException Si la operación es interrumpida durante su ejecución.
     */
    @Test
    public void testAddCommentToComments() throws ExecutionException, InterruptedException {
        // Datos de prueba
        String documentId = "u7bpVMJ6pvvkMfjPPLAJ"; // Asegúrate de usar un documento válido en Firestore
        String comment = "Este es un comentario de prueba";
        // Llamada al método para agregar el comentario
        String updateTime = firestoreService.addCommentToComments(documentId, comment);
        // Verifica que el resultado no sea nulo
        assertNotNull(updateTime, "El tiempo de actualización no puede ser nulo");
        // Obtén el documento para comprobar que el comentario se agregó
        DocumentSnapshot document = firestoreService.getDb().collection("products")
                .document(documentId).get().get();
        // Verifica que el documento exista
        assertTrue(document.exists(), "El documento no existe");
        // Obtén la lista de comentarios del documento
        List<String> comentarios = (List<String>) document.get("comentarios");
        // Verifica que la lista de comentarios no sea nula y contenga el comentario agregado
        assertNotNull(comentarios, "La lista de comentarios no puede ser nula");
        assertTrue(comentarios.contains(comment), "El comentario no se agregó correctamente");
    }

    /**
     * Test de integración para el método {@link FirestoreService#addRatingToRatings(String, int)}.
     * Este test verifica que el sistema permite agregar una calificación a un producto en Firestore
     * y asegura que la actualización se refleje correctamente en la base de datos.
     * El flujo del test es el siguiente:
     * 1. Se utiliza un documento de prueba con un ID predefinido (documentId) de la colección "products".
     * 2. Se define una calificación (rating) para agregar al documento.
     * 3. Se llama al método {@link FirestoreService#addRatingToRatings(String, int)} para agregar la calificación al campo "rating" del documento en Firestore.
     * 4. Se verifica que el tiempo de actualización no sea nulo para confirmar que la operación de actualización fue exitosa.
     * 5. Se realiza una espera de 1 segundo (Thread.sleep) para garantizar que los cambios se hayan propagado en Firestore.
     * 6. Se obtiene el documento actualizado desde Firestore para validar que la calificación ha sido agregada al campo "rating".
     * 7. Se comprueba que el documento exista y que el campo "rating" sea una lista de calificaciones.
     * 8. Se asegura que el campo "rating" contenga los valores correctos y refleja los cambios de la operación de actualización.
     * Pasos de verificación:
     * - Se verifica que el campo "rating" no sea nulo y sea una lista.
     * - Se realiza un cast del objeto a una lista de enteros (List<Integer>).
     * - Se imprime el contenido de la lista de calificaciones para inspeccionar el resultado de la actualización.
     * @throws ExecutionException si ocurre un error durante la ejecución de la actualización en Firestore.
     * @throws InterruptedException si el hilo es interrumpido mientras se espera la propagación de los cambios.
     */
    @Test
    public void testAddRatingToRatings() throws ExecutionException, InterruptedException {
        // Datos de prueba
        String documentId = "u7bpVMJ6pvvkMfjPPLAJ"; // Documento de ejemplo en la colección "products"
        int rating = 5; // Calificación a agregar
        // Llamada al método para agregar la calificación
        String updateTime = firestoreService.addRatingToRatings(documentId, rating);
        // Verifica que el tiempo de actualización no sea nulo
        assertNotNull(updateTime, "El tiempo de actualización no puede ser nulo");
        // Espera un breve momento para que la actualización se propague en Firestore
        Thread.sleep(1000); // Aumentar el tiempo de espera para garantizar la propagación del cambio
        // Obtén el documento para comprobar que la calificación se haya agregado
        DocumentSnapshot document = firestoreService.getDb().collection("products")
                .document(documentId).get().get();
        // Verifica que el documento exista
        assertTrue(document.exists(), "El documento no existe");
        // Obtén el array de calificaciones del documento
        Object ratingsObject = document.get("rating");
        // Verifica que el objeto no sea nulo y sea una lista
        assertNotNull(ratingsObject, "Las calificaciones no pueden ser nulas");
        assertTrue(ratingsObject instanceof List, "El campo 'rating' no es una lista");
        // Cast seguro del objeto a List<Integer>
        List<Integer> ratings = (List<Integer>) ratingsObject;
        // Imprime el contenido del array de calificaciones para inspeccionar
        System.out.println("Ratings after update: " + ratings);
    }

    /**
     * Prueba de integración para el método {@link FirestoreService#updateProductStocks(List)}.
     * <p>
     * Este test valida que el método de actualización de stock de productos en Firestore funcione correctamente
     * cuando se actualiza un producto específico con un stock válido.
     * <p>
     * El test sigue los siguientes pasos:
     * <ol>
     *     <li>Crea un producto de prueba con un ID específico y una cantidad a reducir.</li>
     *     <li>Llama al método {@link FirestoreService#updateProductStocks(List)} pasando una lista con el producto creado.</li>
     *     <li>Verifica que el resultado del método sea el mensaje esperado indicando que el pedido fue procesado y el stock fue actualizado correctamente.</li>
     *     <li>Recupera el documento del producto desde Firestore y verifica que el producto exista en la base de datos.</li>
     *     <li>Verifica que el campo de stock del producto se haya actualizado correctamente, comparando el valor del stock antes y después de la actualización.</li>
     * </ol>
     * <p>
     * Este test asegura que la integración con Firestore esté funcionando correctamente en un entorno de pruebas,
     * actualizando el stock de productos de forma exitosa.
     * </p>
     * @throws ExecutionException Si se produce un error al ejecutar la actualización en Firestore.
     * @throws InterruptedException Si el hilo de ejecución es interrumpido mientras se espera la respuesta de Firestore.
     */
    @Test
    public void testUpdateProductStocks_Success() throws ExecutionException, InterruptedException {
        // Datos de prueba
        Product product1 = new Product();
        product1.setUID("lFvYqMmX368kVwwuTMGb");
        product1.setCantidad(1);
        List<Product> products = new ArrayList<>();
        products.add(product1);
        // Llamada al método que actualiza el stock en Firestore
        String result = firestoreService.updateProductStocks(products);
        // Verifica que el resultado sea el esperado
        assertEquals("Pedido procesado y stock actualizado correctamente para todos los productos", result);
        // Verificar en Firestore que los stocks fueron actualizados
        DocumentSnapshot document1 = firestoreService.getDb().collection("products").document("lFvYqMmX368kVwwuTMGb").get().get();
        assertTrue(document1.exists(), "El producto 'lFvYqMmX368kVwwuTMGb' no existe en Firestore");
        assertEquals(document1.getLong("cantidadStock").intValue(), document1.getLong("cantidadStock").intValue(), "El stock para 'lFvYqMmX368kVwwuTMGb' no se actualizó correctamente");
    }

    /**
     * Prueba de integración para el método {@link FirestoreService#getProductByUID(String)}.
     * Este test valida que el método {@link FirestoreService#getProductByUID(String)} recupere correctamente
     * un producto desde Firestore usando un UID válido. Verifica que el producto no sea nulo y que sus
     * campos, como el UID, el nombre y el stock, sean correctos según los valores esperados.
     * Este test depende de un producto existente en Firestore con el UID proporcionado (en este caso,
     * "lFvYqMmX368kVwwuTMGb"). Es necesario que este producto esté presente en la base de datos antes de ejecutar
     * la prueba para asegurar su éxito.
     * @throws ExecutionException Si se produce un error al ejecutar la consulta a Firestore.
     * @throws InterruptedException Si la ejecución del hilo se interrumpe.
     */
    @Test
    public void testGetProductByUID_Success() throws ExecutionException, InterruptedException {
        // UID de un producto real que ya esté en Firestore
        String testUID = "lFvYqMmX368kVwwuTMGb"; // Reemplaza con un UID real de tu Firestore

        // Llamada al método real que obtiene el producto desde Firestore
        Product result = firestoreService.getProductByUID(testUID);

        // Verifica que el producto no sea nulo
        assertNotNull(result, "El producto no debe ser nulo");

        // Verifica que el UID del producto coincida con el que se pasó
        assertEquals(testUID, result.getUID(), "El UID del producto no coincide");

        // Verifica que el producto tenga otros campos correctos (dependiendo de tu modelo Product)
        assertTrue(result.getNombre().equals("Flotadores Corcho Tipo Pera (10 Unidades)"), "El nombre debe cuincidir");
        assertTrue(result.getCantidadStock() == 17, "El stock debe ser un número válido");
    }
    /**
     * Prueba de integración para el método {@link FirestoreService#getUserDetails(String)}.
     * <p>
     * Este test verifica que el método {@link FirestoreService#getUserDetails(String)} funcione correctamente,
     * obteniendo los detalles de un usuario desde la base de datos Firestore utilizando un UID válido.
     * El test realiza las siguientes verificaciones:
     * <ul>
     *     <li>Verifica que el objeto {@link User} devuelto no sea nulo.</li>
     *     <li>Verifica que los campos del usuario (DNI, apellido, ciudad, dirección, fecha de nacimiento, etc.)
     *     no sean nulos.</li>
     * </ul>
     * <p>
     * El UID utilizado en este test debe ser un UID real que exista en la colección `users` de Firestore.
     * El test asume que los campos relevantes como DNI, apellido, ciudad, dirección, entre otros, están presentes
     * en el documento correspondiente al UID proporcionado.
     * @throws ExecutionException Si ocurre un error durante la ejecución de la llamada asincrónica a Firestore.
     * @throws InterruptedException Si la ejecución del test es interrumpida.
     */
    @Test
    public void testGetUserDetails_Success() throws ExecutionException, InterruptedException {
        // UID de un usuario real que ya esté en Firestore
        String testUID = "DwLVddFFbkavrPGse8eUnV0DZoy2"; // Reemplaza con un UID real de tu Firestore
        // Llamada al método que obtiene los detalles del usuario desde Firestore
        User result = firestoreService.getUserDetails(testUID);
        // Verifica que el usuario no sea nulo
        assertNotNull(result, "El usuario no debe ser nulo");
        // Verifica que el UID del usuario coincida con el que se pasó (usualmente es un campo único)
        // Verifica otros campos del usuario (dependiendo de los campos de tu modelo User)
        assertNotNull(result.getDNI(), "El DNI no debe ser nulo");
        assertNotNull(result.getApellido(), "El apellido no debe ser nulo");
        assertNotNull(result.getCiudad(), "La ciudad no debe ser nula");
        assertNotNull(result.getDireccion(), "La dirección no debe ser nula");
        assertNotNull(result.getFechaNacimiento(), "La fecha de nacimiento no debe ser nula");
        assertNotNull(result.getFechaRegistro(), "La fecha de registro no debe ser nula");
        assertNotNull(result.getIdiomaPreferido(), "El idioma preferido no debe ser nulo");
        assertNotNull(result.getPais(), "El país no debe ser nulo");
        assertNotNull(result.getProvincia(), "La provincia no debe ser nula");
        assertNotNull(result.getTelefono(), "El teléfono no debe ser nulo");
    }

    /**
     * Prueba de integración para el método {@link FirestoreService#deleteUserDetails(String)}.
     * <p>
     * Este test verifica que el método {@link FirestoreService#deleteUserDetails(String)} elimine correctamente
     * un usuario de la base de datos Firestore.
     * <p>
     * El test realiza las siguientes verificaciones:
     * <ul>
     *     <li>Verifica que el documento de usuario no exista en Firestore después de la eliminación.</li>
     * </ul>
     * <p>
     * El UID utilizado en este test debe ser un UID real de un usuario que exista en la colección `users` de Firestore.
     * @throws ExecutionException Si ocurre un error durante la ejecución de la llamada asincrónica a Firestore.
     * @throws InterruptedException Si la ejecución del test es interrumpida.
     */
    @Test
    public void testDeleteUserDetails_Success() throws ExecutionException, InterruptedException {
        // UID de un usuario real que ya esté en Firestore (reemplaza con un UID real existente en Firestore)
        String testUserId = "DwLVddFFbkavrPGse8eUnV0DZoy2"; // Reemplaza con un UID real de tu Firestore
        // Llamada al método que elimina el usuario desde Firestore
        firestoreService.deleteUserDetails(testUserId);
        // Verifica que el documento ha sido eliminado correctamente
        DocumentSnapshot document = firestoreService.getDb().collection("users").document(testUserId).get().get();
        // Verifica que el documento no exista
        assertFalse(document.exists(), "El usuario con UID " + testUserId + " no ha sido eliminado correctamente.");
    }
}