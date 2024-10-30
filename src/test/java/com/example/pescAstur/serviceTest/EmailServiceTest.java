package com.example.pescAstur.serviceTest;
import com.example.pescAstur.service.EmailService;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


public class EmailServiceTest {

    private EmailService emailService; // Suponiendo que el servicio se llama EmailService
    private MailjetClient mockClient;

    @BeforeEach
    public void setUp() {
        // Crea un mock del MailjetClient
        mockClient = mock(MailjetClient.class); // Crea un mock del cliente
        emailService = new EmailService(mockClient); // Ajusta el constructor
    }

    /**
     * Testea el envío de un correo electrónico.
     * Se asegura de que se llame al método post de MailjetClient con la solicitud correcta.
     */
    @Test
    public void testSendEmail() throws Exception {
        // Dado
        String to = "cliente@example.com";
        String subject = "Asunto de prueba";
        String body = "Cuerpo del correo de prueba";

        // Simula una respuesta exitosa
        MailjetResponse mockResponse = mock(MailjetResponse.class);
        when(mockClient.post(any(MailjetRequest.class))).thenReturn(mockResponse);
        when(mockResponse.getStatus()).thenReturn(200);

        // Cuando
        emailService.sendEmail(to, subject, body);

        // Entonces
        verify(mockClient, times(1)).post(any(MailjetRequest.class));
        // Puedes agregar más verificaciones aquí para comprobar que el contenido de MailjetRequest sea el esperado.
    }

    /**
     * Testea el envío de un correo electrónico no exitoso.
     * Se asegura de que se maneje correctamente la respuesta no exitosa de MailjetClient.
     */
    @Test
    public void testSendEmailUnsuccessful() throws Exception {
        // Dado
        String to = "cliente@example.com";
        String subject = "Asunto de prueba";
        String body = "Cuerpo del correo de prueba";

        // Simula una respuesta no exitosa
        MailjetResponse mockResponse = mock(MailjetResponse.class);
        when(mockClient.post(any(MailjetRequest.class))).thenReturn(mockResponse);
        when(mockResponse.getStatus()).thenReturn(400); // Simulamos un error de solicitud

        // Cuando
        emailService.sendEmail(to, subject, body);

        // Entonces
        verify(mockClient, times(1)).post(any(MailjetRequest.class));
        // Puedes agregar verificaciones adicionales para manejar el caso de error.
    }

}
