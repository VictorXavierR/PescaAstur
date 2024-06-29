package com.example.pescAstur.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.stereotype.Service;

@Service
public class FirebaseUserService {
    public String registerUser(String email, String password) {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setPassword(password)
                .setEmailVerified(false)
                .setDisabled(false);

        try {
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            return userRecord.getUid(); // Retorna el UID del usuario creado
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
