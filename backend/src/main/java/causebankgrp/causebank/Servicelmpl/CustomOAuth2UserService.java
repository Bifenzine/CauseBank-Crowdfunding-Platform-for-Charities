package causebankgrp.causebank.Servicelmpl;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import causebankgrp.causebank.Entity.OAuthConnection;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.UserRole;
import causebankgrp.causebank.Exception.Auth_Authorize.CustomException;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Repository.OAuthConnectionRepository;
import causebankgrp.causebank.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final OAuthConnectionRepository oAuthConnectionRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oauth2User = super.loadUser(userRequest);
            // Log the attributes to debug
            log.info("User attributes: {}", oauth2User.getAttributes());

            if (oauth2User == null) {
                throw new ResourceNotFoundException("User not found");
            }

            String email = oauth2User.getAttribute("email");
            String providerId = oauth2User.getAttribute("sub");

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> createNewUser(oauth2User));

            updateOAuthConnection(user, userRequest.getClientRegistration().getRegistrationId(),
                    providerId, oauth2User);

            return oauth2User;
        } catch (Exception e) {
            throw new CustomException("Error loading user: " + e.getMessage());
        }
    }

    private User createNewUser(OAuth2User oauth2User) {
        User user = new User();
        user.setEmail(oauth2User.getAttribute("email"));
        user.setFirstName(oauth2User.getAttribute("given_name"));
        user.setLastName(oauth2User.getAttribute("family_name"));
        user.setAvatarUrl(oauth2User.getAttribute("picture"));
        user.setRole(UserRole.DONOR);
        user.setIsEmailVerified(true);
        return userRepository.save(user);
    }

    private void updateOAuthConnection(User user, String provider, String providerId, OAuth2User oauth2User) {
        OAuthConnection connection = oAuthConnectionRepository
                .findByProviderAndProviderId(provider, providerId)
                .orElseGet(OAuthConnection::new);

        connection.setUser(user);
        connection.setProvider(provider);
        connection.setProviderId(providerId);
        connection.setEmail(oauth2User.getAttribute("email"));
        connection.setName(oauth2User.getAttribute("name"));
        connection.setAvatarUrl(oauth2User.getAttribute("picture"));

        oAuthConnectionRepository.save(connection);
    }
}