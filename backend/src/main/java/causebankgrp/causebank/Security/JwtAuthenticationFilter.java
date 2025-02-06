package causebankgrp.causebank.Security;

import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

//        log.debug("=== Starting JWT Authentication Filter ===");
//        log.debug("Request URL: {} {}", request.getMethod(), request.getRequestURI());
//        log.debug("Request Headers: {}", Collections.list(request.getHeaderNames())
//                .stream()
//                .collect(Collectors.toMap(
//                        Function.identity(),
//                        h -> Collections.list(request.getHeaders(h))
//                )));

        String jwt = null;

        // Check Authorization header first
        final String authHeader = request.getHeader("Authorization");
//        log.debug("Authorization header: {}", authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            log.debug("JWT extracted from Authorization header: {}", jwt);
        } else {
            log.debug("No valid Bearer token found in Authorization header");
        }

        // If no token in header, check cookies
        if (jwt == null && request.getCookies() != null) {
            log.debug("No JWT in header, checking cookies");
            for (Cookie cookie : request.getCookies()) {
//                log.debug("Examining cookie: {}", cookie.getName());
                if ("JWT".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    log.debug("JWT found in cookies: {}", jwt);
                    break;
                }
            }
        } else if (request.getCookies() == null) {
            log.debug("No cookies present in request");
        }

        // If no token found, continue filter chain
        if (jwt == null) {
            log.debug("No JWT token found in request, continuing filter chain without authentication");
            filterChain.doFilter(request, response);
            return;
        }

        try {
//            log.debug("=== Processing JWT Token ===");
//            log.debug("Attempting to extract email from JWT");
            String userEmail = jwtUtil.extractEmail(jwt);
//            log.debug("Extracted email from JWT: {}", userEmail);

            Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
//            log.debug("Current authentication in SecurityContext: {}", currentAuth);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                log.debug("Looking up user by email: {}", userEmail);
                User user = userRepository.findByEmail(userEmail).orElse(null);

                if (user != null) {
//                    log.debug("Found user: {} with role: {}", user.getEmail(), user.getRole());
//
//                    log.debug("Validating JWT token for user");
                    boolean isValid = jwtUtil.validateToken(jwt, user);
//                    log.debug("JWT token validation result: {}", isValid);

                    if (isValid) {
                        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
//                        log.debug("User authorities: {}", authorities);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                user, null, authorities);

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
//                        log.debug("Authentication token set in SecurityContext");
                    } else {
                        log.warn("JWT token validation failed for user: {}", userEmail);
                    }
                } else {
                    log.warn("No user found for email: {}", userEmail);
                }
            } else {
                log.debug("Skipping authentication: userEmail is {} and SecurityContext authentication is {}",
                        userEmail, currentAuth != null ? "present" : "null");
            }
        } catch (Exception e) {
            log.error("Error processing JWT token", e);
            log.error("Exception details:", e);
        }

        log.debug("=== Completing JWT filter, continuing filter chain ===");
        filterChain.doFilter(request, response);
    }
}