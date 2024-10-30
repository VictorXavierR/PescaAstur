package com.example.pescAstur.controllerTest;
import com.example.pescAstur.controller.EmailController;
import com.example.pescAstur.model.EmailRequest;
import com.example.pescAstur.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class EmailControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private EmailController emailController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Prueba el método {@link EmailController#sendEmail(EmailRequest)} para un escenario exitoso
     * donde se envía un correo electrónico correctamente.
     * <p>
     * La prueba crea un objeto {@link EmailRequest} con información válida y simula que
     * el {@link EmailService} envía el correo electrónico sin errores. Se realiza una solicitud
     * POST al endpoint correspondiente y se verifica que la respuesta tenga un estado HTTP 200
     * y un mensaje que indique que el correo electrónico fue enviado con éxito.
     * </p>
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
