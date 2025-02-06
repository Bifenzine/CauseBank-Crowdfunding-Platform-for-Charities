package causebankgrp.causebank.Services;

import causebankgrp.causebank.Dto.AuthDTO.Response.AuthResponse;
import causebankgrp.causebank.Dto.AuthDTO.request.LoginRequest;
import causebankgrp.causebank.Dto.AuthDTO.request.SignupRequest;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;

// import causebankgrp.causebank.Models.UserModel;
// 5
public interface AuthService {
    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request , HttpServletResponse response);

    AuthResponse adminLogin(LoginRequest request, HttpServletResponse response);

    void logout(String token);

    ApiResponse<Void> verifyEmail(String token);

    AuthResponse loginWithOAuth(String provider, String providerId, String email, String name, String avatarUrl);
    // void logoutWithOAuth(String provider, String providerId);
}
