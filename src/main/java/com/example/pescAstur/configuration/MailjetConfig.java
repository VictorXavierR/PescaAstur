package com.example.pescAstur.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
@Configuration
public class MailjetConfig {

    @Value("${mailjet.api.key}")
    private String mailjetApiKey;

    @Value("${mailjet.api.secret}")
    private String mailjetApiSecret;

    /**
     * Crea un bean de MailjetClient para ser inyectado en otras partes de la aplicación.
     * @return Un MailjetClient configurado con la clave y secreto de la API.
     */
    @Bean
    public MailjetClient mailjetClient() {
        ClientOptions options = ClientOptions.builder()
                .apiKey(mailjetApiKey)
                .apiSecretKey(mailjetApiSecret)
                .build();
        return new MailjetClient(options);
    }
}
