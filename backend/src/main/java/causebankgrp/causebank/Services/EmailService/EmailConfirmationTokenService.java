package causebankgrp.causebank.Services.EmailService;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import causebankgrp.causebank.Entity.EmailConfirmationToken;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Repository.EmailRepository.EmailConfirmationTokenRepository;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailConfirmationTokenService {
    private final EmailConfirmationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${app.email.token.expiration:24}")
    private int tokenExpirationHours;

    public EmailConfirmationToken createToken(User user) {
        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);

        String tokenString = generateRandomToken();

        EmailConfirmationToken confirmationToken = EmailConfirmationToken.builder()
                .id(UUID.randomUUID().toString())
                .token(tokenString)
                .user(user)
                .createdAt(LocalDate.now())
                .expiryDate(LocalDateTime.now().plusHours(tokenExpirationHours))
                .build();

        EmailConfirmationToken savedToken = tokenRepository.save(confirmationToken);
        log.debug("Created confirmation token for user {}: {}", user.getEmail(), tokenString);

        return savedToken;
    }

    public <EmailApiResponse> EmailConfirmationToken verifyToken(String token) {
        EmailConfirmationToken confirmationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found"));

        if (confirmationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(confirmationToken);
            throw new ResourceNotFoundException("Token has expired");
        }

        User user = confirmationToken.getUser();
        if (user.getIsEmailVerified()) {
            throw new ResourceNotFoundException("Email already verified");
        }

        user.setIsEmailVerified(true);

        // The user repository save will be handled by the service layer

        // Delete the used token
        tokenRepository.delete(confirmationToken);

        return confirmationToken;
    }

    public void resendVerificationToken(User user) {
        EmailConfirmationToken newToken = createToken(user);
        emailService.sendVerificationEmail(user, newToken.getToken());
        log.info("Resent verification email to user: {}", user.getEmail());
    }

    private String generateRandomToken() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
