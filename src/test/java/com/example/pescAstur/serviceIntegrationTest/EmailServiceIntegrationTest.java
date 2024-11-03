package com.example.pescAstur.serviceIntegrationTest;
import com.example.pescAstur.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
@SpringBootTest
public class EmailServiceIntegrationTest {
    @Autowired
    private EmailService emailService;

    /**
     * Test de integración para enviar un correo electrónico.
     * <p>Este test verifica que el servicio de correo electrónico puede
     * enviar un correo a un destinatario válido sin lanzar excepciones.
     * Se utilizará un correo electrónico de prueba.
     * @throws Exception si ocurre algún error durante el envío del correo.
     */
    @Test
    void sendEmail_Success() throws Exception {
        // Datos del correo electrónico
        String to = "qch22978@educastur.es"; //
        String subject = "Asunto de prueba";
        String body = "Cuerpo del correo de prueba.";

        // Asegurarse de que el envío de correo no lanza excepciones
        assertDoesNotThrow(() -> emailService.sendEmail(to, subject, body));
    }
}
