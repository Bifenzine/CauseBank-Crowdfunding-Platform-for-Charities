package causebankgrp.causebank.Servicelmpl;

import causebankgrp.causebank.Dto.OrganizationDTO.Request.OrganizationRequest;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.OrganizationResponse;
import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.UserRole;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Helpers.OrganizationMapper;
import causebankgrp.causebank.Repository.BookmarkRepository;
import causebankgrp.causebank.Repository.OrganizationRepository;
import causebankgrp.causebank.Repository.UserRepository;
import causebankgrp.causebank.Services.OrganizationService;
import causebankgrp.causebank.Services.CloudinaryService.CloudinaryService;
import causebankgrp.causebank.Utils.Auth_Authorize.AuthenticationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationServiceImpl implements OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final AuthenticationUtils authenticationUtils;
    private final UserRepository userRepository;
    private final OrganizationMapper organizationMapper;
    private final BookmarkRepository bookmarkRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public ApiResponse<OrganizationResponse> createOrganization(OrganizationRequest request, MultipartFile logo) {
        if (!authenticationUtils.isUserConnected()) {
            return ApiResponse.error("You are not connected");
        }

        User authUser = authenticationUtils.getCurrentAuthenticatedUser();

        if (organizationRepository.existsByName(request.getName())) {
            return ApiResponse.error("Organization name is already in use");
        }

        try {
            // Handle logo upload
            if (logo != null && !logo.isEmpty()) {
                String logoUrl = cloudinaryService.uploadFile(logo);
                request.setLogoUrl(logoUrl);
            }

            Organization organization = organizationMapper.toEntity(request, authUser);

            if (!authenticationUtils.isCurrentUserAdmin()) {
                userRepository.updateUserRole(authUser.getId(), UserRole.ORGANIZATION);
            }

            Organization savedOrganization = organizationRepository.save(organization);

            return ApiResponse.success(
                    organizationMapper.toResponseDTO(savedOrganization),
                    "Organization created successfully");
        } catch (IOException e) {
            return ApiResponse.error("Failed to upload logo: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<OrganizationResponse> getOrganization(UUID id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        return ApiResponse.success(
                organizationMapper.toResponseDTO(organization),
                "Organization retrieved successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<OrganizationResponse> getUserOrganizations(UUID id) {
        // User authUser = authenticationUtils.getCurrentAuthenticatedUser();
        Organization organizations = organizationRepository
                .findByUser_Id(id);

        return ApiResponse.success(
                organizationMapper.toResponseDTO(organizations),
                "User organizations retrieved successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<OrganizationResponse>> getAllOrganizations() {
        List<Organization> organizations = organizationRepository.findAll();

        return ApiResponse.success(
                organizations.stream()
                        .map(organizationMapper::toResponseDTO)
                        .collect(Collectors.toList()),
                "All organizations retrieved successfully");
    }

    @Override
    @Transactional
    public ApiResponse<OrganizationResponse> updateOrganization(UUID id, OrganizationRequest request,
            MultipartFile logo) {
        if (!authenticationUtils.isUserConnected()) {
            return ApiResponse.error("You are not connected");
        }

        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        User authUser = authenticationUtils.getCurrentAuthenticatedUser();
        if (!existingOrganization.getUser().getId().equals(authUser.getId()) &&
                !authenticationUtils.isCurrentUserOrganization()) {
            return ApiResponse.error("You are not authorized to update this organization");
        }

        if (request.getName() != null &&
                !request.getName().equals(existingOrganization.getName()) &&
                organizationRepository.existsByName(request.getName())) {
            return ApiResponse.error("Organization name is already in use");
        }

        try {
            // Handle logo update
            String existingLogoUrl = existingOrganization.getLogoUrl();

            if (logo != null) {
                // If we received a new logo file
                if (!logo.isEmpty()) {
                    // Delete existing logo if present
                    if (existingLogoUrl != null && !existingLogoUrl.isEmpty()) {
                        cloudinaryService.deleteFile(existingLogoUrl);
                        log.atInfo().log("delete existing logo file: " + existingLogoUrl);
                    }
                    // Upload new logo
                    String newLogoUrl = cloudinaryService.uploadFile(logo);
                    request.setLogoUrl(newLogoUrl);
                    log.atInfo().log("upload new logo: " + newLogoUrl);
                } else {
                    // If we received an empty file, it means we should remove the logo
                    if (existingLogoUrl != null && !existingLogoUrl.isEmpty()) {
                        cloudinaryService.deleteFile(existingLogoUrl);
                        log.atInfo().log("delete existing logo: " + existingLogoUrl);
                    }
                    request.setLogoUrl(null);
                    log.atInfo().log("remove existing logo: and make it null");
                }
            } else {
                // If no logo was provided in the request, keep the existing one
                request.setLogoUrl(existingLogoUrl);
                log.atInfo().log("keep existing logo: " + existingLogoUrl);
            }

            organizationMapper.updateEntity(existingOrganization, request);
            Organization savedOrganization = organizationRepository.save(existingOrganization);

            return ApiResponse.success(
                    organizationMapper.toResponseDTO(savedOrganization),
                    "Organization updated successfully");
        } catch (IOException e) {
            log.error("Error handling logo update", e);
            return ApiResponse.error("Failed to handle logo: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteOrganization(UUID id) {
        if (!authenticationUtils.isUserConnected()) {
            return ApiResponse.error("You are not connected");
        }

        Organization existingOrganization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        User authUser = authenticationUtils.getCurrentAuthenticatedUser();
        if (!existingOrganization.getUser().getId().equals(authUser.getId()) &&
                !authenticationUtils.isCurrentUserOrganization()) {
            return ApiResponse.error("You are not authorized to delete this organization");
        }

        // Delete all bookmarks associated with the organization's causes
        existingOrganization.getCauses().forEach(cause -> {
         bookmarkRepository.deleteAllByCauseId(cause.getId());
            log.atInfo().log("Deleted all bookmarks associated with organization cause");
        });

        // Delete logo from Cloudinary if exists
        if (existingOrganization.getLogoUrl() != null) {
            try {
                cloudinaryService.deleteFile(existingOrganization.getLogoUrl());
                log.atInfo().log("Deleted organization logo from Cloudinary");
            } catch (IOException e) {
                log.error("Failed to delete organization logo from Cloudinary", e);
                // Continue with organization deletion even if logo deletion fails
            }
        }

        // Now delete the organization (this will cascade to causes)
        organizationRepository.delete(existingOrganization);

        if (authenticationUtils.isCurrentUserOrganization()) {
            userRepository.updateUserRole(authUser.getId(), UserRole.DONOR);
        }

        return ApiResponse.success(null, "Organization deleted successfully your role is " + authUser.getRole());
    }

    @Override
    public boolean isOrganizationNameTaken(String name) {
        return organizationRepository.existsByName(name);
    }

    @Override
    public boolean isRegistrationNumberTaken(String registrationNumber) {
        return organizationRepository.existsByRegistrationNumber(registrationNumber);
    }

    @Override
    @Transactional
    public ApiResponse<OrganizationResponse> verifyOrganization(UUID id) {
        if (!authenticationUtils.isUserConnected()) {
            return ApiResponse.error("You are not connected");
        }
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (!authenticationUtils.isCurrentUserAdmin()) {
            return ApiResponse.error("Only admins can verify organizations");
        }

        organization.setIsVerified(true);
        Organization savedOrganization = organizationRepository.save(organization);

        return ApiResponse.success(
                organizationMapper.toResponseDTO(savedOrganization),
                "Organization verified successfully");
    }

    @Override
    @Transactional
    public ApiResponse<OrganizationResponse> unverifyOrganization(UUID id) {
        if (!authenticationUtils.isUserConnected()) {
            return ApiResponse.error("You are not connected");
        }
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (!authenticationUtils.isCurrentUserAdmin()) {
            return ApiResponse.error("Only admins can unverify organizations");
        }

        organization.setIsVerified(false);
        Organization savedOrganization = organizationRepository.save(organization);

        return ApiResponse.success(
                organizationMapper.toResponseDTO(savedOrganization),
                "Organization unverified successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<OrganizationResponse>> getOrganizationsByCity(String city) {
        List<Organization> organizations = organizationRepository.findByCity(city);

        return ApiResponse.success(
                organizations.stream()
                        .map(organizationMapper::toResponseDTO)
                        .collect(Collectors.toList()),
                "Organizations retrieved by city successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<OrganizationResponse>> getOrganizationsByCountry(String country) {
        List<Organization> organizations = organizationRepository.findByCountry(country);

        return ApiResponse.success(
                organizations.stream()
                        .map(organizationMapper::toResponseDTO)
                        .collect(Collectors.toList()),
                "Organizations retrieved by country successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<OrganizationResponse>> getOrganizationsByVerificationStatus(Boolean isVerified) {
        if (!authenticationUtils.isUserConnected()) {
            return ApiResponse.error("You are not connected");
        }

        if (!authenticationUtils.isCurrentUserAdmin()) {
            return ApiResponse.error("Only admins can retrieve organizations by verification status");
        }

        List<Organization> organizations = organizationRepository.findByIsVerified(isVerified);

        return ApiResponse.success(
                organizations.stream()
                        .map(organizationMapper::toResponseDTO)
                        .collect(Collectors.toList()),
                "Organizations retrieved by verification status successfully");
    }
}