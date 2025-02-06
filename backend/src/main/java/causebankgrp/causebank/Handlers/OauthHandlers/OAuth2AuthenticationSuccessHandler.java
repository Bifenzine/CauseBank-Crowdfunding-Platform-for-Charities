package causebankgrp.causebank.Handlers.OauthHandlers;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import causebankgrp.causebank.Security.JwtUtil;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import causebankgrp.causebank.Dto.AuthDTO.Response.AuthResponse;
import causebankgrp.causebank.Services.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.url}")
    private String appUrl;

    private final JwtUtil jwtUtil;
    private AuthService authService;

    @Autowired
    public void setAuthService(@Lazy AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

            // Extract user details
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String picture = oAuth2User.getAttribute("picture");
            String providerId = oAuth2User.getAttribute("sub");

            // Get authentication response
            AuthResponse authResponse = authService.loginWithOAuth(
                    "google",
                    providerId,
                    email,
                    name,
                    picture);

            // Create and set the JWT cookie
            Cookie jwtCookie = jwtUtil.createTokenCookie(authResponse.getToken());
            response.addCookie(jwtCookie);

            // Create redirect URL with token in hash fragment for frontend
            String redirectUrl = UriComponentsBuilder.fromUriString(appUrl)
                    .path("/auth/success")
                    .fragment("token=" + authResponse.getToken() + "&user=" +
                            URLEncoder.encode(new ObjectMapper().writeValueAsString(authResponse.getUser()),
                                    StandardCharsets.UTF_8))
                    .build().toUriString();

            response.setHeader("Access-Control-Allow-Origin", appUrl);
            response.setHeader("Access-Control-Allow-Credentials", "true");

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            logger.error("OAuth authentication error", e);
            getRedirectStrategy().sendRedirect(request, response,
                    appUrl + "/auth/error?message=" +
                            URLEncoder.encode("Authentication failed: " + e.getMessage(), StandardCharsets.UTF_8));
        }
    }
}