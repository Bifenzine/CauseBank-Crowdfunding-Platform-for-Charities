package causebankgrp.causebank.Servicelmpl;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import causebankgrp.causebank.Dto.CauseSearchCriteriaDTO.CauseSearchCriteria;
import causebankgrp.causebank.Enums.CauseMediaType;
import causebankgrp.causebank.Exception.Auth_Authorize.UnauthorizedException;
import causebankgrp.causebank.Helpers.SearchSpecification.CauseSpecification;
import causebankgrp.causebank.Repository.*;
import causebankgrp.causebank.Services.CloudinaryService.CloudinaryService;
import causebankgrp.causebank.Tasks.Causes.CauseStatusUpdateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import causebankgrp.causebank.Dto.CausesDTO.Request.CauseRequest;
import causebankgrp.causebank.Dto.CausesDTO.Response.CauseResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.CauseMediaDTO.Request.CauseMediaRequest;
import causebankgrp.causebank.Dto.CauseMediaDTO.Response.CauseMediaResponse;
import causebankgrp.causebank.Entity.Category;
import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Entity.CauseMedia;
import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.CauseStatus;
import causebankgrp.causebank.Enums.UserRole;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Helpers.CauseMapper;
import causebankgrp.causebank.Helpers.CauseMediaMapper;
import causebankgrp.causebank.Services.CauseService;
import causebankgrp.causebank.Utils.Auth_Authorize.AuthenticationUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CauseServiceImpl implements CauseService {

    private final CauseRepository causeRepository;
    private final CauseMediaRepository causeMediaRepository;
    private final OrganizationRepository organizationRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CategoryRepository categoryRepository;
    private final CauseMapper causeMapper;
    private final CauseMediaMapper causeMediaMapper;
    private final AuthenticationUtils authenticationUtils;
    private final CloudinaryService cloudinaryService;
    private final CauseStatusUpdateService causeStatusUpdateService;

    @Override
    @Transactional
    public ApiResponse<CauseResponse> createCause(CauseRequest causeRequest,
                                                  MultipartFile featuredImage,
                                                  MultipartFile[] media) {
        try {
            // Check user authentication
//            log.atInfo().log("Checking user authentication {} " , authenticationUtils.isUserConnected());
            if (!authenticationUtils.isUserConnected()) {
                return ApiResponse.error("You are not connected to causebank");
            }

            Organization organization = organizationRepository.findById(causeRequest.getOrganizationId())
                    .orElseThrow(() -> new EntityNotFoundException("Organization not found"));

            // Check if organization is verified
            if (!organization.getIsVerified()) {
                return ApiResponse.error("Organization is not verified yet");
            }

            if (!authenticationUtils.getCurrentAuthenticatedUserId().equals(organization.getUser().getId())) {
                return ApiResponse.error("You are not authorized to create a cause for this organization");
            }


            // Handle featured image upload
            try {
                if (featuredImage != null && !featuredImage.isEmpty()) {
                    String featuredImageUrl = cloudinaryService.uploadFile(featuredImage);
                    causeRequest.setFeaturedImageUrl(featuredImageUrl);
                }
            } catch (IOException e) {
                log.error("Failed to upload featured image", e);
                return ApiResponse.error("Failed to upload featured image: " + e.getMessage());
            }

            // Handle media uploads and create media requests
            List<CauseMediaRequest> mediaRequests = new ArrayList<>();
            try {
                if (media != null && media.length > 0) {
                    for (int i = 0; i < media.length; i++) {
                        String mediaUrl = cloudinaryService.uploadFile(media[i]);
                        CauseMediaRequest mediaRequest = new CauseMediaRequest();
                        mediaRequest.setMediaType(CauseMediaType.IMAGE);
                        mediaRequest.setMediaUrl(mediaUrl);
                        mediaRequest.setDisplayOrder(i + 1);
                        mediaRequests.add(mediaRequest);
                    }
                }
            } catch (IOException e) {
                // Cleanup any uploaded files before throwing error
                mediaRequests.forEach(mr -> {
                    try {
                        if (mr.getMediaUrl() != null) {
                            cloudinaryService.deleteFile(mr.getMediaUrl());
                        }
                    } catch (Exception ex) {
                        log.error("Error cleaning up media after failure", ex);
                    }
                });
                if (causeRequest.getFeaturedImageUrl() != null) {
                    try {

                        cloudinaryService.deleteFile(causeRequest.getFeaturedImageUrl());
                    } catch (Exception ex) {
                        log.error("Error cleaning up featured image after failure", ex);
                    }
                }
                log.error("Failed to upload media files", e);
                return ApiResponse.error("Failed to upload media files: " + e.getMessage());
            }

            Category category = categoryRepository.findById(causeRequest.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));

            // generate unique slug
            causeRequest.setSlug(causeRequest.getTitle().replace(" ", "-") + "-" + UUID.randomUUID());

            // Create and populate cause
            Cause cause = causeMapper.requestToCause(causeRequest);
            cause.setOrganization(organization);
            cause.setSlug(causeRequest.getSlug());
            cause.setCategory(category);
            cause.setStatus(causeRequest.getStatus());
            cause.setCauseCountry(causeRequest.getCountry());
            cause.setCurrentAmount(BigDecimal.ZERO);
            cause.setDonorCount(0);
            cause.setViewCount(0);
            cause.setIsFeatured(causeRequest.getIsFeatured());


            Cause savedCause = causeRepository.save(cause);

            // Handle media attachments
            if (!mediaRequests.isEmpty()) {
                List<CauseMedia> mediaList = mediaRequests.stream()
                        .map(mediaRequest -> {
                            CauseMedia mediaEntity = causeMediaMapper.toEntity(mediaRequest, savedCause);
                            mediaEntity.setCause(savedCause);
                            return mediaEntity;
                        })
                        .collect(Collectors.toList());
                causeMediaRepository.saveAll(mediaList);
            }

            return ApiResponse.success(causeMapper.toResponse(savedCause), "Cause created successfully");
        } catch (Exception e) {
            log.error("Error creating cause", e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<CauseResponse> updateCause(UUID id,
                                                  CauseRequest causeRequest,
                                                  MultipartFile featuredImage,
                                                  MultipartFile[] media,
                                                  List<UUID> deletedMediaIds) {
        log.atInfo().log("Update cause request: {}", causeRequest);
        try {
            if (authenticationUtils.getCurrentAuthenticatedUser() == null) {
                log.atInfo().log("User not connected to causebank");
                return ApiResponse.error("You are not connected to causebank");
            }

            // Get current authenticated user
            User authUser = authenticationUtils.getCurrentAuthenticatedUser();

            // Retrieve existing cause
            Cause existingCause = causeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Cause not found"));

            if (!existingCause.getOrganization().getUser().getId().equals(authUser.getId())) {
                return ApiResponse.error("You are not authorized to update this cause");
            }

            log.atInfo().log("Existing cause: {}", existingCause);
            log.atInfo().log("Request cause: {}", causeRequest);

            // Handle featured image update
            handleFeaturedImageUpdate(existingCause, causeRequest, featuredImage);

            // Update cause details first
            causeMapper.updateCauseFromRequest(causeRequest, existingCause);
            existingCause.setStatus(causeRequest.getStatus()); //now organization can update status
            existingCause.setEndDate(causeRequest.getEndDate());

            // Save updated cause
            Cause updatedCause = causeRepository.save(existingCause);

            // Handle media updates
            handleMediaUpdates(updatedCause, media, deletedMediaIds);

            return ApiResponse.success(causeMapper.toResponse(updatedCause), "Cause updated successfully");
        } catch (Exception e) {
            log.error("Error updating cause", e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    public void softDeleteCause(UUID id) {
        // Validate authentication
        if (authenticationUtils.getCurrentAuthenticatedUser() == null) {
            throw new UnauthorizedException("You must be connected to CauseBank");
        }

        // Get current user
        User currentUser = authenticationUtils.getCurrentAuthenticatedUser();
        if (!UserRole.ORGANIZATION.equals(currentUser.getRole())) {
            throw new UnauthorizedException("Only organizations can delete causes");
        }

        // Find and validate cause
        Cause cause = causeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cause not found with id: " + id));

        // Validate ownership
        if (!cause.getOrganization().getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this cause");
        }

        try {
            // Delete bookmarks
            bookmarkRepository.deleteBookmarkByCauseId(id);
            log.info("Deleted bookmarks for cause: {}", id);

            // Update cause status
            cause.setStatus(CauseStatus.DELETED);
            cause.setIsFeatured(false);
            causeRepository.save(cause);
            log.info("Cause soft deleted successfully: {}", id);

        } catch (Exception e) {
            log.error("Error soft deleting cause {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to soft delete cause", e);
        }
    }

    @Transactional
    public void updateExpiredCauseStatuses() {
        causeStatusUpdateService.updateCauseStatuses();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CauseStatus> getAllStatus() {
        return List.of(CauseStatus.values());
    }

    @Override
    @Transactional
    public ApiResponse<CauseResponse> getCauseById(UUID id) {
        incrementViewCount(id);
        return ApiResponse.success(causeMapper.toResponse(causeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cause not found with id: " + id))),
                "Cause found");
    }

    @Override
    @Transactional(readOnly = true)
    public List<CauseMediaResponse> getCauseMediaByCauseId(UUID causeId) {
        return causeMediaRepository.findByCauseId(causeId).stream()
                .map(causeMediaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CauseResponse getCauseBySlug(String slug) {
        return causeRepository.findBySlugWithDetails(slug)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Cause not found with slug: " + slug));
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> getAllCauses(Pageable pageable) {
        // check if there are any causes
        if (causeRepository.count() == 0) {
            return ApiResponse.error("No causes found");
        }
        // use causemapper to convert to response

        return ApiResponse.success(causeRepository.findAll(pageable).map(this::convertToDTO), "Causes found");
    }


    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> getCausesByOrganization(UUID organizationId, CauseStatus status,
            Pageable pageable) {
        try {
            // check if there are any causes
            if (causeRepository.count() == 0) {
                return ApiResponse.error("No causes found");
            }
            // check if the organization exists
            if (!organizationRepository.existsById(organizationId)) {
                return ApiResponse.error("Organization not found");
            }
            // get the causes for the organization

            return ApiResponse.success(causeRepository.findByOrganizationId(organizationId, pageable)
                    .map(this::convertToDTO), "Causes found for organization");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> getActiveAndCompletedCausesByOrganization(UUID organizationId, Pageable pageable) {
        try {
            // check if there are any causes
            if (causeRepository.count() == 0) {
                return ApiResponse.error("No causes found");
            }
            // check if the organization exists
            if (!organizationRepository.existsById(organizationId)) {
                return ApiResponse.error("Organization not found");
            }
            // get the causes for the organization
            return ApiResponse.success(causeRepository.findActiveCausesByOrganizationId(organizationId, pageable)
                    .map(this::convertToDTO), "Causes found for organization");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> getCauseByCountry(String country, Pageable pageable) {
        // check if there are any causes
        if (causeRepository.count() == 0) {
            return ApiResponse.error("No causes found");
        }
        // get the causes for the country
        return ApiResponse.success(causeRepository.findByCauseCountry(country, pageable)
                .map(this::convertToDTO), "Causes found for country");

    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> getCausesByCategory(UUID categoryId, Pageable pageable) {
        // check if there are any causes
        if (causeRepository.count() == 0) {
            return ApiResponse.error("No causes found");
        }
        // check if the category exists
        if (!categoryRepository.existsById(categoryId)) {
            return ApiResponse.error("Category not found");
        }

        return ApiResponse.success(causeRepository.findByCategoryId(categoryId, pageable)
                .map(this::convertToDTO), "Causes found for category");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> getFeaturedCauses(Pageable pageable) {

        return ApiResponse.success(causeRepository.findByIsFeaturedTrueAndStatus(CauseStatus.ACTIVE, pageable)
                .map(this::convertToDTO), "Featured causes found");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<String>> getAllCountryCauses() {
        return ApiResponse.success(causeRepository.findAllCountries(CauseStatus.ACTIVE), "Countries found");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> searchCauses(String searchTerm, CauseStatus status, Pageable pageable) {
        return ApiResponse.success(causeRepository.searchCauses(searchTerm, status, pageable).map(this::convertToDTO),
                "Causes found");
    }

    @Override
    public ApiResponse<Void> updateCauseStatus(UUID id, CauseStatus status) {
        // User authUser = authenticationUtils.getCurrentAuthenticatedUser();
        try {
            // if the authuser role is not organization and admin, throw exception
            if (!authenticationUtils.getCurrentAuthenticatedUserId()
                    .equals(causeRepository.findById(id).get().getOrganization().getUser().getId())) {
                return ApiResponse.error("You are not authorized to update the status of this cause");
            }

            Cause cause = getCauseEntity(id);
            cause.setStatus(status);
            causeRepository.save(cause);
            return ApiResponse.success(null, "Cause status updated successfully");
        } catch (EntityNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    public ApiResponse<Void> updateDonationAmount(UUID id, BigDecimal amount) {
        try {
            Cause cause = getCauseEntity(id);
            if (cause == null) {
                return ApiResponse.error("Cause not found");
            }
            if (cause.getStatus() != CauseStatus.ACTIVE) {
                return ApiResponse.error("Cause is not active");
            }
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                return ApiResponse.error("Donation amount must be greater than zero");
            }
            cause.setCurrentAmount(cause.getCurrentAmount().add(amount));
            cause.setDonorCount(cause.getDonorCount() + 1);
            causeRepository.save(cause);
            return ApiResponse.success(null, "Donation amount updated successfully");
        } catch (EntityNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID id) {
        causeRepository.incrementViewCount(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<CauseResponse>> getCausesNearGoal(double percentageRemaining) {

        return ApiResponse.success(causeRepository.findCausesNearGoal(CauseStatus.ACTIVE, percentageRemaining)
                .stream()
                .map(this::convertToDTO).collect(Collectors.toList()),
                "Causes near goal found");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<CauseResponse>> getCausesEndingSoon(int daysThreshold) {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime threshold = now.plusDays(daysThreshold);
        return ApiResponse.success(causeRepository.findCausesEndingSoon(CauseStatus.ACTIVE, now, threshold)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()), "Causes ending soon found");
    }

    @Override
    public ApiResponse<Boolean> toggleFeatureStatus(UUID id) {
        try {
            Cause cause = getCauseEntity(id);
            if (cause == null) {
                return ApiResponse.error("Cause not found");
            }
            if (cause.getOrganization().getId() != authenticationUtils.getCurrentAuthenticatedUserId()) {
                return ApiResponse.error("You are not authorized to toggle the feature status of this cause");
            }

            cause.setIsFeatured(!cause.getIsFeatured());
            causeRepository.save(cause);
            return ApiResponse.success(true, "Feature status toggled successfully");

        } catch (EntityNotFoundException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    private Cause getCauseEntity(UUID id) {
        return causeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cause not found with id: " + id));
    }

    private CauseResponse convertToDTO(Cause cause) {
        // CauseResponse dto = new CauseResponse();
        // BeanUtils.copyProperties(cause, dto);
        // return dto;
        // to get cause details in the response with full details for nested objects
        return causeMapper.toResponse(cause);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<CauseResponse>> searchCausesWithFilters(CauseSearchCriteria criteria, Pageable pageable) {
        try {
            Specification<Cause> spec = CauseSpecification.withSearchCriteria(criteria);
            Page<Cause> causes = causeRepository.findAll(spec, pageable);

            if (causes.isEmpty()) {
                return ApiResponse.success(Page.empty(), "No causes found matching the criteria");
            }

            return ApiResponse.success(causes.map(this::convertToDTO), "Causes found successfully");
        } catch (Exception e) {
            return ApiResponse.error("Error searching causes: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<CauseResponse> checkAndUpdateGoalStatus(UUID id) {
        return null;
    }

    @Override
    public ApiResponse<CauseResponse> processDonation(UUID id, BigDecimal amount) {
        return null;
    }

    @Override
    public ApiResponse<Page<CauseResponse>> getCompletedCauses(Pageable pageable) {
        return null;
    }

    @Override
    public ApiResponse<Page<CauseResponse>> getCausesByCompletionStatus(boolean isCompleted, Pageable pageable) {
        return null;
    }

    @Override
    public ApiResponse<Double> getCompletionPercentage(UUID id) {
        return null;
    }

    private void validateMediaToDelete(List<UUID> mediaToDelete, UUID causeId) {
        List<CauseMedia> existingMedia = causeMediaRepository.findAllById(mediaToDelete);
        if (existingMedia.size() != mediaToDelete.size()) {
            throw new ResourceNotFoundException("One or more media items not found");
        }

        boolean allBelongToCause = existingMedia.stream()
                .allMatch(media -> media.getCause().getId().equals(causeId));
        if (!allBelongToCause) {
            throw new IllegalArgumentException("Some media items do not belong to this cause");
        }
    }

    private void deleteMediaFiles(List<UUID> mediaToDelete) {
        for (UUID mediaId : mediaToDelete) {
            CauseMedia mediaToRemove = causeMediaRepository.findById(mediaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Media not found: " + mediaId));

            try {
                if (mediaToRemove.getMediaUrl() != null && !mediaToRemove.getMediaUrl().isEmpty()) {
                    cloudinaryService.deleteFile(mediaToRemove.getMediaUrl());
                    log.atDebug().log("Deleted media file: {}", mediaToRemove.getMediaUrl());
                }
                causeMediaRepository.delete(mediaToRemove);
            } catch (IOException e) {
                log.error("Failed to delete media file: {}", mediaToRemove.getMediaUrl(), e);
                throw new RuntimeException("Failed to delete media file", e);
            }
        }
    }
    private void handleFeaturedImageUpdate(Cause existingCause, CauseRequest causeRequest, MultipartFile featuredImage) throws IOException {
        String existingFeaturedImageUrl = existingCause.getFeaturedImageUrl();

        if (featuredImage != null) {
            if (!featuredImage.isEmpty()) {
                // Delete existing featured image if present
                if (existingFeaturedImageUrl != null && !existingFeaturedImageUrl.isEmpty()) {
                    cloudinaryService.deleteFile(existingFeaturedImageUrl);
                    log.debug("Deleted existing featured image: {}", existingFeaturedImageUrl);
                }
                // Upload new featured image
                String newFeaturedImageUrl = cloudinaryService.uploadFile(featuredImage);
                causeRequest.setFeaturedImageUrl(newFeaturedImageUrl);
                log.debug("Uploaded new featured image: {}", newFeaturedImageUrl);
            } else {
                // Remove featured image if empty file is provided
                if (existingFeaturedImageUrl != null && !existingFeaturedImageUrl.isEmpty()) {
                    cloudinaryService.deleteFile(existingFeaturedImageUrl);
                    log.debug("Deleted existing featured image: {}", existingFeaturedImageUrl);
                }
                causeRequest.setFeaturedImageUrl(null);
            }
        } else {
            // Keep existing featured image
            causeRequest.setFeaturedImageUrl(existingFeaturedImageUrl);
            log.debug("Kept existing featured image: {}", existingFeaturedImageUrl);
        }
    }

    private List<CauseMedia> handleNewMediaUploads(MultipartFile[] mediaFiles, Cause cause, int startingDisplayOrder) throws IOException {
        List<CauseMedia> newMediaList = new ArrayList<>();
        int displayOrder = startingDisplayOrder;

        for (MultipartFile mediaFile : mediaFiles) {
            if (!mediaFile.isEmpty()) {
                String mediaUrl = cloudinaryService.uploadFile(mediaFile);

                CauseMedia media = CauseMedia.builder()
                        .cause(cause)
                        .mediaType(CauseMediaType.IMAGE)
                        .mediaUrl(mediaUrl)
                        .displayOrder(++displayOrder)
                        .build();

                newMediaList.add(media);
                log.debug("Uploaded new media file: {}", mediaUrl);
            }
        }

        return newMediaList;
    }

    private void handleMediaUpdates(Cause cause, MultipartFile[] newMedia, List<UUID> deletedMediaIds) throws IOException {
        // Step 1: Handle deletions first
        if (deletedMediaIds != null && !deletedMediaIds.isEmpty()) {
            validateMediaToDelete(deletedMediaIds, cause.getId());
            deleteMediaFiles(deletedMediaIds);
        }

        // Step 2: Upload and save new media
        if (newMedia != null && newMedia.length > 0) {
            // Get current max display order
            Integer maxDisplayOrder = causeMediaRepository.findMaxDisplayOrderByCauseId(cause.getId())
                    .orElse(0);

            List<CauseMedia> newMediaEntities = new ArrayList<>();

            for (MultipartFile mediaFile : newMedia) {
                if (!mediaFile.isEmpty()) {
                    try {
                        String mediaUrl = cloudinaryService.uploadFile(mediaFile);

                        CauseMedia mediaEntity = CauseMedia.builder()
                                .cause(cause)
                                .mediaType(CauseMediaType.IMAGE)
                                .mediaUrl(mediaUrl)
                                .displayOrder(++maxDisplayOrder)
                                .build();

                        newMediaEntities.add(mediaEntity);
                        log.debug("Uploaded new media file: {}", mediaUrl);
                    } catch (Exception e) {
                        // If any upload fails, clean up the ones that succeeded
                        cleanupNewlyUploadedMedia(newMediaEntities);
                        throw e;
                    }
                }
            }

            if (!newMediaEntities.isEmpty()) {
                causeMediaRepository.saveAll(newMediaEntities);
            }
        }
    }


    private void cleanupNewlyUploadedMedia(List<CauseMedia> mediaEntities) {
        for (CauseMedia media : mediaEntities) {
            try {
                if (media.getMediaUrl() != null) {
                    cloudinaryService.deleteFile(media.getMediaUrl());
                    log.debug("Cleaned up newly uploaded media: {}", media.getMediaUrl());
                }
            } catch (Exception ex) {
                log.error("Error cleaning up media after failure", ex);
            }
        }
    }

}