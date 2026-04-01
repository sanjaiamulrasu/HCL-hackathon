package com.hcl.hotelbooking;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
public class MailTest {

    @Autowired
    private JavaMailSender mailSender;

    @Test
    public void testMail() {
        System.out.println("Starting MailTest...");
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("poove93@gmail.com");
            message.setSubject("Test From MailTest");
            message.setText("This is a test message to verify authentication.");
            mailSender.send(message);
            System.out.println("MailTest Success!");
        } catch (Exception e) {
            System.err.println("MailTest Failed!");
            e.printStackTrace();
        }
    }
}
