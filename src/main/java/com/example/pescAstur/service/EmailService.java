package com.example.pescAstur.service;

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

    /**
     * Envía un correo electrónico a un destinatario.
     * @param to Correo electrónico del destinatario.
     * @param subject Asunto del correo.
     * @param body Cuerpo del correo.
     */
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Sending email to: " + to);
        ClientOptions options = ClientOptions.builder()
                .apiKey(mailjetApiKey)
                .apiSecretKey(mailjetApiSecret)
                .build();
        MailjetClient client = new MailjetClient(options);
        MailjetRequest request;
        MailjetResponse response;
        request = new MailjetRequest(Emailv31.resource)
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
            response = client.post(request);
            System.out.println(response.getStatus());
            System.out.println(response.getData());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
