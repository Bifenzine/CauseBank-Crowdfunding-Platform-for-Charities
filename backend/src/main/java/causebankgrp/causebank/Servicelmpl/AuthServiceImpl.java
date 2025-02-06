package causebankgrp.causebank.Servicelmpl;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import causebankgrp.causebank.Dto.AuthDTO.Response.AuthResponse;
import causebankgrp.causebank.Dto.AuthDTO.request.LoginRequest;
import causebankgrp.causebank.Dto.AuthDTO.request.SignupRequest;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Entity.EmailConfirmationToken;
import causebankgrp.causebank.Entity.OAuthConnection;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.UserRole;
import causebankgrp.causebank.Exception.Auth_Authorize.AuthException;
import causebankgrp.causebank.Helpers.AuthMapper;
import causebankgrp.causebank.Repository.OAuthConnectionRepository;
import causebankgrp.causebank.Repository.UserRepository;
import causebankgrp.causebank.Security.JwtUtil;
import causebankgrp.causebank.Services.AuthService;
import causebankgrp.causebank.Services.EmailService.EmailConfirmationTokenService;
import causebankgrp.causebank.Services.EmailService.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final OAuthConnectionRepository oAuthConnectionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthMapper authMapper;
    private final EmailConfirmationTokenService tokenService;
    private final EmailService emailService; // The email service we created earlier

    @Override
    public AuthResponse signup(SignupRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new AuthException("Email already exists");
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setRole(request.getRole());
            user.setPhone(request.getPhone());
            user.setIsEmailVerified(false);
            user.setIsPhoneVerified(false);
            user.setIsActive(true);

            user = userRepository.save(user);
            // String token = jwtUtil.generateToken(user);

            // Generate confirmation token
            EmailConfirmationToken confirmationToken = tokenService.createToken(user);

            // Send verification email using the template
            emailService.sendVerificationEmail(user, confirmationToken.getToken());

            return AuthResponse.builder()
                    // .token(token)
                    .user(authMapper.toUserDTO(user))
                    .build();
        } catch (AuthException ae) {
            logger.error("Authentication error during signup: {}", ae.getMessage(), ae);
            throw ae;
        } catch (Exception e) {
            throw new AuthException("An error occurred during signup " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<Void> verifyEmail(String token) {
        // log.info("Starting email verification process for token: {}", token);
        try {
            EmailConfirmationToken verificationToken = tokenService.verifyToken(token);
            log.info("Found token: {}", verificationToken != null);

            if (verificationToken == null) {
                return new ApiResponse<>(false, "Invalid verification token", null);
            }

            if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return new ApiResponse<>(false, "Verification token has expired", null);
            }

            User user = verificationToken.getUser();
            user.setIsEmailVerified(true);
            user.setUpdatedAt(ZonedDateTime.now());
            userRepository.save(user);

            // Optionally delete the used token already in the emailConfirmationTokenService
            // tokenService.deleteVerificationToken(verificationToken);

            // log.info("Email verification completed successfully");
            return new ApiResponse<>(true, "Email verified successfully", null);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Error verifying email: " + e.getMessage(), null);
        }
    }

    @Override
    public AuthResponse login(LoginRequest request , HttpServletResponse response) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AuthException("Invalid email or password"));

            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new AuthException("Invalid email or password");
            }

            if (!user.getIsActive()) {
                throw new AuthException("Account is disabled");
            }

            String token = jwtUtil.generateToken(user);
            user.setLastLoginAt(ZonedDateTime.now());

            Cookie tokenCookie = jwtUtil.createTokenCookie(token);
            // Add the cookie to the response
            response.addCookie(tokenCookie);

            userRepository.save(user);

            return AuthResponse.builder()
                    .user(authMapper.toUserDTO(user))
                    .build();
        } catch (AuthException ae) {
            logger.error("Authentication error during login: {}", ae.getMessage(), ae);
            throw ae;
        } catch (Exception e) {
            logger.error("Unexpected error during login: {}", e.getMessage(), e);
            throw new AuthException("An error occurred during login");
        }
    }

    @Override
    public AuthResponse adminLogin(LoginRequest request , HttpServletResponse response) {
        try {
            // Find the user by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AuthException("Invalid email or password"));

            // Check if the user has the ADMIN role
            if (user.getRole() != UserRole.ADMIN) {
                throw new AuthException("Access denied. Only admins can log in here.");
            }

            // Verify the password
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                throw new AuthException("Invalid email or password");
            }

            // Check if the account is active
            if (!user.getIsActive()) {
                throw new AuthException("Account is disabled");
            }

            // Generate a JWT token
            String token = jwtUtil.generateToken(user);
            user.setLastLoginAt(ZonedDateTime.now());
            // Create a cookie with the token
            Cookie tokenCookie = jwtUtil.createTokenCookie(token);
            response.addCookie(tokenCookie);
            userRepository.save(user);

            return AuthResponse.builder()

                    .user(authMapper.toUserDTO(user))
                    .build();
        } catch (AuthException ae) {
            logger.error("Authentication error during admin login: {}", ae.getMessage(), ae);
            throw ae;
        } catch (Exception e) {
            logger.error("Unexpected error during admin login: {}", e.getMessage(), e);
            throw new AuthException("An error occurred during admin login");
        }
    }

    @Override
    public void logout(String token) {
        try {
            logger.info("Logout request for token: {}", token);
            // Token invalidation logic can be added here if needed
        } catch (Exception e) {
            logger.error("Error during logout: {}", e.getMessage(), e);
            throw new AuthException("An error occurred during logout");
        }
    }

    @Override
    public AuthResponse loginWithOAuth(String provider, String providerId, String email, String name,
            String avatarUrl) {
        try {
            // Check if the user already exists
            OAuthConnection oauthConnection = oAuthConnectionRepository
                    .findByProviderAndProviderId(provider, providerId)
                    .orElse(null);

            User user;
            if (oauthConnection == null) {
                // Create new user and link OAuth connection
                user = new User();
                user.setEmail(email);
                user.setFirstName(name.split(" ")[0]);
                user.setLastName(name.split(" ").length > 1 ? name.split(" ")[1] : "");
                user.setAvatarUrl(avatarUrl);
                user.setRole(UserRole.DONOR); // Default role for OAuth users
                user.setIsActive(true);
                user.setIsEmailVerified(true);

                user = userRepository.save(user);

                // Save OAuth connection
                oauthConnection = new OAuthConnection();
                oauthConnection.setProvider(provider);
                oauthConnection.setProviderId(providerId);
                oauthConnection.setEmail(email);
                oauthConnection.setName(name);
                oauthConnection.setAvatarUrl(avatarUrl);

                oAuthConnectionRepository.save(oauthConnection);
            } else {
                // Get the linked user
                user = userRepository.findByEmail(oauthConnection.getEmail())
                        .orElseThrow(() -> new AuthException("User not found for OAuth login"));
            }

            String token = jwtUtil.generateToken(user);

            return AuthResponse.builder()
                    .token(token)
                    .user(authMapper.toUserDTO(user))
                    .build();
        } catch (Exception e) {
            throw new AuthException("Error during OAuth login: " + e.getMessage());
        }
    }

}