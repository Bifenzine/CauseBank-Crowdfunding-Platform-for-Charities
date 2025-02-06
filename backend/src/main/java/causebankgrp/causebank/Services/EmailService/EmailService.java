package causebankgrp.causebank.Services.EmailService;

import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Services.EmailService.EmailTemplate.EmailTemplateService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final EmailTemplateService templateService;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(User user, String token) {
        String verificationLink = templateService.getAppUrl() + "/verify-email?token=" + token;

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("headerTitle", "Verify Your Email");
        templateModel.put("userName", user.getFirstName());
        templateModel.put("verificationLink", verificationLink);

        String emailContent = templateService.generateEmailContent("email/verification", templateModel);

        sendHtmlEmail(
                user.getEmail(),
                "Verify Your CauseBank Account",
                emailContent);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
