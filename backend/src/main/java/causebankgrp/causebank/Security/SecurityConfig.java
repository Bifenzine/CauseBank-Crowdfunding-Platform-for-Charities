package causebankgrp.causebank.Security;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.util.UriComponentsBuilder;

import causebankgrp.causebank.Handlers.OauthHandlers.OAuth2AuthenticationSuccessHandler;
import causebankgrp.causebank.Servicelmpl.CustomOAuth2UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpMethod;

// dev config
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
        private final JwtAuthenticationFilter jwtAuthFilter;
        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

        @Bean
        SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
                http.csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configure(http)) // Explicitly enable CORS
                                .authorizeHttpRequests(requests -> requests
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow all
                                                                                                        // OPTIONS
                                                                                                        // requests
                                                .requestMatchers("/api/v1/auth/**", "/api/v1/organization/**",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**", "/webjars/**", "/**",
                                                                "/swagger-ui.html", "/api/v1/users/**",
                                                                "/login/oauth2/code/*", "/oauth2/**",
                                                                "/api/v1/**")
                                                .permitAll()
                                                .requestMatchers("/api/v1/bookmarks/**")
                                                .hasAnyRole("DONOR", "ADMIN", "ORGANIZATION")
                                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/v1/user/**").hasAnyRole("DONOR", "ADMIN")
                                                .requestMatchers("/api/v1/users/allUsers").hasAnyAuthority("ADMIN")
                                                .anyRequest().authenticated()

                                )
                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler(new SimpleUrlAuthenticationFailureHandler() {
                                                        @Override
                                                        public void onAuthenticationFailure(HttpServletRequest request,
                                                                        HttpServletResponse response,
                                                                        AuthenticationException exception)
                                                                        throws IOException, ServletException {
                                                                String targetUrl = UriComponentsBuilder
                                                                                .fromUriString("http://localhost:5173")
                                                                                .path("/auth/error")
                                                                                .queryParam("message",
                                                                                                exception.getMessage())
                                                                                .build().toUriString();
                                                                getRedirectStrategy().sendRedirect(request, response,
                                                                                targetUrl);
                                                        }
                                                }))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

}