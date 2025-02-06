package causebankgrp.causebank.Services;

import java.util.List;
import java.util.UUID;

import causebankgrp.causebank.Dto.OrganizationDTO.Request.OrganizationRequest;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.OrganizationResponse;
import org.springframework.web.multipart.MultipartFile;

public interface OrganizationService {
    // Create a new organization for the authenticated user
    ApiResponse<OrganizationResponse> createOrganization(OrganizationRequest request, MultipartFile logo);

    // Update an existing organization (only by owner or admin)
    ApiResponse<OrganizationResponse> updateOrganization(UUID id, OrganizationRequest request, MultipartFile logo);

    // Delete an organization (only by owner or admin)
    ApiResponse<Void> deleteOrganization(UUID id);

    // Get a specific organization (only by owner or admin)
    ApiResponse<OrganizationResponse> getOrganization(UUID id);

    // Get all organizations for the authenticated user
    ApiResponse<OrganizationResponse> getUserOrganizations(UUID id);

    // Admin-only method to get all organizations
    ApiResponse<List<OrganizationResponse>> getAllOrganizations();

    // Check if an organization name is already taken
    boolean isOrganizationNameTaken(String name);

    // Check if an organization with a specific registration number exists
    boolean isRegistrationNumberTaken(String registrationNumber);

    // Verify an organization (admin-only)
    ApiResponse<OrganizationResponse> verifyOrganization(UUID id);

    // unverify an organization (admin-only)
    ApiResponse<OrganizationResponse> unverifyOrganization(UUID id);

    // Get organizations by specific criteria
    ApiResponse<List<OrganizationResponse>> getOrganizationsByCity(String city);

    ApiResponse<List<OrganizationResponse>> getOrganizationsByCountry(String country);

    // Get organizations with specific verification status (admin-only)
    ApiResponse<List<OrganizationResponse>> getOrganizationsByVerificationStatus(Boolean isVerified);
}