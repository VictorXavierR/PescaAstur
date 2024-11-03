package com.example.pescAstur.controllerIntegrationTest;
import com.example.pescAstur.model.EmailRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import com.example.pescAstur.service.EmailService;
@SpringBootTest
@AutoConfigureMockMvc
public class EmailControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmailService emailService; // Usar el EmailService real

    @BeforeEach
    void setUp() {
        // No es necesario inicializar mocks, ya que usamos el contexto real
    }

    /**
     * Prueba el método {@linkEmailController sendEmail(EmailRequest)} para un escenario exitoso.
     *
     * Este método simula una solicitud POST al endpoint de envío de correo electrónico con un objeto
     * {@link EmailRequest} que contiene la dirección de correo electrónico del destinatario, el asunto
     * y el cuerpo del mensaje. Se espera que la respuesta sea un estado HTTP 200 y un mensaje indicando
     * que el correo electrónico fue enviado con éxito.
     *
     * @throws Exception si hay un error durante la ejecución de la prueba.
     */
    @Test
    void testSendEmail_Success() throws Exception {
        // Arrange
        EmailRequest emailRequest = new EmailRequest();
        emailRequest.setTo("test@example.com");
        emailRequest.setSubject("Asunto de prueba");
        emailRequest.setBody("Cuerpo del correo de prueba");

        // Act & Assert
        mockMvc.perform(post("/api/email/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(emailRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("Email sent successfully"));
    }
}
