package causebankgrp.causebank.Utils.Auth_Authorize;

import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.UserRole;
import causebankgrp.causebank.Exception.Auth_Authorize.UnauthorizedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AuthenticationUtils {
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new UnauthorizedException("No authenticated user found");
    }

    public UUID getCurrentAuthenticatedUserId() {
        User user = getCurrentAuthenticatedUser();
        return user.getId();
    }

    // check if user connected
    public boolean isUserConnected() {
        // Get the current authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if user is authenticated and is not an anonymous user
        return authentication != null &&
                authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken);
    }
    

    public boolean isCurrentUserAdmin() {
    User user = getCurrentAuthenticatedUser();
    return user.getRole() == UserRole.ADMIN;
}
public boolean isCurrentUserOrganization() {
    User user = getCurrentAuthenticatedUser();
    return user.getRole() == UserRole.ORGANIZATION;
}
public boolean isCurrentUserDonor() {
    User user = getCurrentAuthenticatedUser();
    return user.getRole() == UserRole.DONOR;
}

    public boolean isCurrentUserOwnResource(UUID resourceOwnerId) {
        return getCurrentAuthenticatedUserId().equals(resourceOwnerId);
    }
}