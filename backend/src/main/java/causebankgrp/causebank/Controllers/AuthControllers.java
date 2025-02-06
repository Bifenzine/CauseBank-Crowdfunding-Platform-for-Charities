package causebankgrp.causebank.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import causebankgrp.causebank.Dto.AuthDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.AuthDTO.Response.AuthResponse;
import causebankgrp.causebank.Dto.AuthDTO.request.LoginRequest;
import causebankgrp.causebank.Dto.AuthDTO.request.SignupRequest;
import causebankgrp.causebank.Dto.EmailDTO.EmailApiResponse;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Security.JwtUtil;
import causebankgrp.causebank.Services.AuthService;
import causebankgrp.causebank.Services.UserService;
import causebankgrp.causebank.Services.EmailService.EmailConfirmationTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// where we will handle the api

@RestController
@Slf4j
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
@Tag(name = "Auth Management", description = "APIs for managing Authentification")
@SecurityRequirement(name = "JWT")
public class AuthControllers {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final EmailConfirmationTokenService tokenService;

    @Operation(summary = "signup a new user", description = "register a new user")
    // tested with postman : working
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "User registered successfully",
                authService.signup(request)));
    }

    @Operation(summary = "login a user", description = "login a user and get the token")
    // tested with postman : working
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        try {
            // Authenticate the user and get the response with the token
            AuthResponse authResponse = authService.login(request,response);

            // Return the response inside ApiResponse
            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Login failed"));
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        try {
            // Authenticate the admin and get the response with the token
            AuthResponse authResponse = authService.adminLogin(request ,response);

            // Return the response inside ApiResponse
            return ResponseEntity.ok(ApiResponse.success("Admin login successful", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Admin login failed: " + e.getMessage()));
        }
    }



    @Operation(summary = "login with OAuth", description = "login with OAuth")
    // not implemented yet
    @PostMapping("/oauth/login")
    public ResponseEntity<AuthResponse> loginWithOAuth(
            @RequestParam String provider,
            @RequestParam String providerId,
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String avatarUrl) {
        return ResponseEntity.ok(authService.loginWithOAuth(provider, providerId, email, name, avatarUrl));
    }

    @Operation(summary = "logout a user", description = "logout a user and invalidate the token")
    // tested with postman : working
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie logoutCookie = jwtUtil.createLogoutCookie();
        response.addCookie(logoutCookie);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @Operation(summary = "verify email", description = "verify email")
    @GetMapping("/verify-email")
    public ResponseEntity<EmailApiResponse> verifyEmail(@RequestParam String token) {
        log.info("Verifying email with token: {}", token);
        try {
            authService.verifyEmail(token);
            return ResponseEntity.ok(
                    new EmailApiResponse(true, "Email verified successfully"));
        } catch (ResourceNotFoundException e) {
            log.warn("Email verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new EmailApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmailApiResponse> resendVerificationEmail(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.getUserEntityByEmail(userDetails.getUsername());

            if (user.getIsEmailVerified()) {
                return ResponseEntity.badRequest().body(
                        new EmailApiResponse(false, "Email is already verified"));
            }

            tokenService.resendVerificationToken(user);
            return ResponseEntity.ok(new EmailApiResponse(
                    true,
                    "Verification email has been resent"));
        } catch (Exception e) {
            log.error("Failed to resend verification email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new EmailApiResponse(false, "Failed to resend verification email"));
        }
    }
}