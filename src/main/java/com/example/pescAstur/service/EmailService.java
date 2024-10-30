package com.example.pescAstur.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;


@Service
public class EmailService {
    @Value("${mailjet.api.key}")
    private String mailjetApiKey;

    @Value("${mailjet.api.secret}")
    private String mailjetApiSecret;

    private final MailjetClient mailjetClient;

    /**
     * Constructor de EmailService.
     * @param mailjetClient El cliente de Mailjet a utilizar (opcional). Si es nulo, se crea uno nuevo.
     */
    @Autowired
    public EmailService(MailjetClient mailjetClient) {
        this.mailjetClient = mailjetClient;
    }

    /**
     * Envía un correo electrónico a un destinatario.
     * @param to Correo electrónico del destinatario.
     * @param subject Asunto del correo.
     * @param body Cuerpo del correo.
     */
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Sending email to: " + to);

        MailjetRequest request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                        .put(new JSONObject()
                                .put(Emailv31.Message.FROM, new JSONObject()
                                        .put("Email", "xavierrodriguezvictor@gmail.com")
                                        .put("Name", "PescaAstur"))
                                .put(Emailv31.Message.TO, new JSONArray()
                                        .put(new JSONObject()
                                                .put("Email", to)
                                                .put("Name", "Cliente")))
                                .put(Emailv31.Message.SUBJECT, subject)
                                .put(Emailv31.Message.TEXTPART, body)
                                .put(Emailv31.Message.HTMLPART, "<h3>" + body + "</h3>")
                                .put(Emailv31.Message.CUSTOMID, "AppGettingStartedTest")));
        try {
            MailjetResponse response = mailjetClient.post(request);
            System.out.println(response.getStatus());
            System.out.println(response.getData());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
