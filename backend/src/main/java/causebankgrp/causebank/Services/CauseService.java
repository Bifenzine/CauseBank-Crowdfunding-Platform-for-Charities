package causebankgrp.causebank.Services;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import causebankgrp.causebank.Dto.CauseSearchCriteriaDTO.CauseSearchCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import causebankgrp.causebank.Dto.CausesDTO.Request.CauseRequest;
import causebankgrp.causebank.Dto.CausesDTO.Response.CauseResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.CauseMediaDTO.Response.CauseMediaResponse;
import causebankgrp.causebank.Enums.CauseStatus;
import org.springframework.web.multipart.MultipartFile;

public interface CauseService {
        ApiResponse<CauseResponse> createCause(CauseRequest causeRequest,
                                               MultipartFile featuredImage,
                                               MultipartFile[] media);

        ApiResponse<CauseResponse> updateCause(UUID id,
                                               CauseRequest causeRequest,
                                               MultipartFile featuredImage,
                                               MultipartFile[] media,
                                               List<UUID> deletedMediaIds);

        void softDeleteCause(UUID id);

        List<CauseStatus> getAllStatus();

        List<CauseMediaResponse> getCauseMediaByCauseId(UUID causeId);

        ApiResponse<CauseResponse> getCauseById(UUID id);

        CauseResponse getCauseBySlug(String slug);

        ApiResponse<Page<CauseResponse>> getAllCauses(Pageable pageable);

        ApiResponse<Page<CauseResponse>> getCausesByOrganization(UUID organizationId, CauseStatus status,
                                                                 Pageable pageable);

        ApiResponse<Page<CauseResponse>> getActiveAndCompletedCausesByOrganization(UUID organizationId, Pageable pageable);

        ApiResponse<Page<CauseResponse>> getCausesByCategory(UUID categoryId, Pageable pageable);

        ApiResponse<Page<CauseResponse>> getFeaturedCauses(Pageable pageable);

        ApiResponse<List<String>> getAllCountryCauses();

        ApiResponse<Page<CauseResponse>> getCauseByCountry(String country, Pageable pageable);

        ApiResponse<Page<CauseResponse>> searchCauses(String searchTerm, CauseStatus status, Pageable pageable);

        ApiResponse<Void> updateCauseStatus(UUID id, CauseStatus status);

        ApiResponse<Void> updateDonationAmount(UUID id, BigDecimal amount);

        void incrementViewCount(UUID id);

        ApiResponse<List<CauseResponse>> getCausesNearGoal(double percentageRemaining);

        ApiResponse<List<CauseResponse>> getCausesEndingSoon(int daysThreshold);

        ApiResponse<Boolean> toggleFeatureStatus(UUID id);

        ApiResponse<Page<CauseResponse>> searchCausesWithFilters(CauseSearchCriteria criteria, Pageable pageable);

        // New methods for goal completion functionality
        ApiResponse<CauseResponse> checkAndUpdateGoalStatus(UUID id);

        ApiResponse<CauseResponse> processDonation(UUID id, BigDecimal amount);

        // New method to get all completed causes
        ApiResponse<Page<CauseResponse>> getCompletedCauses(Pageable pageable);

        // New method to get causes by completion status
        ApiResponse<Page<CauseResponse>> getCausesByCompletionStatus(boolean isCompleted, Pageable pageable);

        // New method to get completion percentage
        ApiResponse<Double> getCompletionPercentage(UUID id);
}