package causebankgrp.causebank.Dto.OrganizationDTO.Request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationRequest {
    @NotBlank(message = "Organization name is required")
    @Size(min = 2, max = 100, message = "Organization name must be between 2 and 100 characters")
    private String name;
    @Size(max = 255, message = "Description must be max 255 characters")
    private String description;

    private String websiteUrl;

    private String logoUrl;

    @Size(max = 50, message = "Registration number must be max 50 characters")
    private String registrationNumber;

    @Size(max = 50, message = "Tax ID must be max 50 characters")
    private String taxId;

    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    private String state;

    // @NotBlank(message = "Postal code is required")
    private String postalCode;

    @NotBlank(message = "Country is required")
    private String country;

    // User ID to associate the organization with a user
    private UUID userId;
}
