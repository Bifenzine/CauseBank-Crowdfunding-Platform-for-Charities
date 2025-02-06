package causebankgrp.causebank.Dto.OrganizationDTO.Response;

import java.time.ZonedDateTime;
import java.util.UUID;

import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse {
    private UUID id;
    private String name;
    private String description;
    private String websiteUrl;
    private String logoUrl;
    private String registrationNumber;
    private String taxId;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String stripeAccountId;
    private Boolean isVerified;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private UUID userId; // ID of the associated user
    // private String userFullName;
    private UserRole userRole;

    public static OrganizationResponse fromEntity(Organization organization) {
        return new OrganizationResponse(
                organization.getId(),
                organization.getName(),
                organization.getDescription(),
                organization.getWebsiteUrl(),
                organization.getLogoUrl(),
                organization.getRegistrationNumber(),
                organization.getTaxId(),
                organization.getAddressLine1(),
                organization.getAddressLine2(),
                organization.getCity(),
                organization.getState(),
                organization.getStripeAccountId(),
                organization.getPostalCode(),
                organization.getCountry(),
                organization.getIsVerified(),
                organization.getCreatedAt(),
                organization.getUpdatedAt(),
                organization.getUser().getId(),
                organization.getUser().getRole()
        );
    }
}
