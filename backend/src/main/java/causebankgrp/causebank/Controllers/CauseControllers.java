package causebankgrp.causebank.Controllers;

import causebankgrp.causebank.Dto.CauseSearchCriteriaDTO.CauseSearchCriteria;
import causebankgrp.causebank.Enums.CauseMediaType;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Exception.Auth_Authorize.UnauthorizedException;
import causebankgrp.causebank.Services.CloudinaryService.CloudinaryService;
import causebankgrp.causebank.Tasks.Causes.CauseStatusUpdateService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import causebankgrp.causebank.Dto.CausesDTO.Request.CauseRequest;
import causebankgrp.causebank.Dto.CausesDTO.Response.CauseResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.CauseMediaDTO.Request.CauseMediaRequest;
import causebankgrp.causebank.Dto.CauseMediaDTO.Response.CauseMediaResponse;
import causebankgrp.causebank.Enums.CauseStatus;
import causebankgrp.causebank.Services.CauseService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/causes")
@RequiredArgsConstructor
@Tag(name = "Cause Management", description = "APIs for managing charitable causes")
@SecurityRequirement(name = "JWT")
public class CauseControllers {

    private final CauseService causeService;
    private final CauseStatusUpdateService causeStatusUpdateService;

    @Operation(summary = "Create a new cause")
    @PostMapping(
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE}
    )
    public ResponseEntity<ApiResponse<CauseResponse>> createCause(
            @Valid @RequestPart(value = "cause", required = true) CauseRequest causeRequest,
            @RequestPart(value = "featuredImage", required = false) MultipartFile featuredImage,
            @RequestPart(value = "media", required = false) MultipartFile[] media) {

        return ResponseEntity.ok(causeService.createCause(causeRequest, featuredImage, media));
    }

    @Operation(summary = "Update an existing cause")
    @PutMapping(value = "/{id}",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<CauseResponse>> updateCause(
            @Parameter(description = "Cause ID", required = true) @PathVariable UUID id,
            @Valid @RequestPart(value = "updatedCauseDetails", required = true) CauseRequest causeRequest,
            @RequestPart(value = "featuredImage", required = false) MultipartFile featuredImage,
            @RequestPart(value = "media", required = false) MultipartFile[] media,
            @RequestPart(value = "deletedMediaIds", required = false) String deletedMediaIdsJson) {

        List<UUID> deletedMediaIds = null;
        if (deletedMediaIdsJson != null && !deletedMediaIdsJson.isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                deletedMediaIds = Arrays.asList(mapper.readValue(deletedMediaIdsJson, UUID[].class));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Invalid deletedMediaIds format", e);
            }
        }


        return ResponseEntity.ok(causeService.updateCause(id, causeRequest, featuredImage, media, deletedMediaIds));
    }

    @Operation(summary = "Delete a cause")

    // tested with postman : working only author of the organization
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCause(@PathVariable UUID id) {
//        log.debug("Delete cause request received for id: {}", id);
//        log.debug("Current authentication: {}", SecurityContextHolder.getContext().getAuthentication());
//        log.debug("Authentication details: {}", SecurityContextHolder.getContext().getAuthentication().getDetails());
//        log.debug("Authentication principal: {}", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        try {
            causeService.softDeleteCause(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Cause deleted successfully"));
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting cause: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error processing deletion request"));
        }
    }

    @Operation(summary = "Get cause media")
    @GetMapping("/{id}/media")
    public ResponseEntity<List<CauseMediaResponse>> getCauseMedia(
            @Parameter(description = "Cause ID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(causeService.getCauseMediaByCauseId(id));
    }

    @Operation(summary = "Get cause by Id")
    // tested with postman : working all users
    @GetMapping("/causeId/{id}")
    public ResponseEntity<ApiResponse<CauseResponse>> getCausebyId(
            @Parameter(description = "Cause slug", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(causeService.getCauseById(id));
    }

    @Operation(summary = "Get all causes")
    // tested with postman : working all users
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> getAllCauses(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(causeService.getAllCauses(pageable));
    }

    @Operation(summary = "get featured and active causes")
    // tested with postman : working all users
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> getFeaturedCauses(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        return ResponseEntity.ok(causeService.getFeaturedCauses(pageable));
    }


    @Operation(summary = "Get causes by organization")
    // tested with postman : working all users
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> getCausesByOrganization(
            @Parameter(description = "Organization ID", required = true) @PathVariable UUID organizationId,
            @Parameter(description = "Cause status filter") @RequestParam(required = false) CauseStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(causeService.getCausesByOrganization(organizationId, status, pageable));
    }


    @Operation(summary = "Get Active and Completed Featured causes by organization")
    // tested with postman : working all users
    @GetMapping("/organization/{organizationId}/Active-Completed-featured")
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> getFeaturedCausesByOrganization(
            @Parameter(description = "Organization ID", required = true) @PathVariable UUID organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(causeService.getActiveAndCompletedCausesByOrganization(organizationId, pageable));
    }

    @Operation(summary = "Get causes near goal completion")
    // tested with postman : testing...
    @GetMapping("/near-goal")
    public ResponseEntity<ApiResponse<List<CauseResponse>>> getCausesNearGoal(
            @Parameter(description = "Percentage remaining to reach goal", required = true) @RequestParam double percentageRemaining) {
        return ResponseEntity.ok(causeService.getCausesNearGoal(percentageRemaining));
    }

    @Operation(summary = "Get causes ending soon")
    // tested with postman : testing...
    @GetMapping("/ending-soon")
    public ResponseEntity<ApiResponse<List<CauseResponse>>> getCausesEndingSoon(
            @Parameter(description = "Days threshold", required = true) @RequestParam int daysThreshold) {
        return ResponseEntity.ok(causeService.getCausesEndingSoon(daysThreshold));
    }

    @Operation(summary = "Toggle cause feature status")
    // tested with postman : working only author of the organization
    @PatchMapping("/{id}/feature")
    public ResponseEntity<ApiResponse<Boolean>> toggleFeatureStatus(
            @Parameter(description = "Cause ID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(causeService.toggleFeatureStatus(id));
    }

    @Operation(summary = "get causes by category id")
    // tested with postman : working all users
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> getCausesByCategory(
            @Parameter(description = "Category ID", required = true) @PathVariable UUID categoryId,
            Pageable pageable) {
        return ResponseEntity.ok(causeService.getCausesByCategory(categoryId, pageable));
    }
    @Operation(summary = "Check and update cause status based on goal completion")
    @PatchMapping("/{id}/check-goal")
    public ResponseEntity<ApiResponse<CauseResponse>> checkAndUpdateGoalStatus(
            @Parameter(description = "Cause ID", required = true) @PathVariable UUID id) {
        return ResponseEntity.ok(causeService.checkAndUpdateGoalStatus(id));
    }

    @Operation(summary = "get All Countries")
    // tested with postman : working all users
    @GetMapping("/countries")
    public ResponseEntity<List<String>> getAllCountries() {
        return ResponseEntity.ok(causeService.getAllCountryCauses().getData());
    }

    @Operation(summary = "get Causes by Country")
    // tested with postman : working all users
    @GetMapping("/country/{country}")
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> getCauseByCountry(
            @Parameter(description = "Country", required = true) @PathVariable String country,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(causeService.getCauseByCountry(country, pageable));
    }

    @Operation(summary = "getAllCauseStatus")
    // tested with postman : working all users
    @GetMapping("/status")
    public ResponseEntity<List<CauseStatus>> getAllCauseStatus() {
        return ResponseEntity.ok(causeService.getAllStatus());
    }

//    add before /featured before search to work with only active and featured causes
    @GetMapping("/featured/search")
    public ResponseEntity<ApiResponse<Page<CauseResponse>>> searchCauses(
            @RequestParam(required = false) String searchTerm,
//            @RequestParam(required = false) CauseStatus status,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID organizationId,
            @RequestParam(required = false) String country,
//            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime endDate,
            @RequestParam(required = false) Double percentageToGoal, // New parameter for near goal
            @RequestParam(required = false) Integer daysToEnd, // New parameter for ending soon
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
//        if (status == null) {
//            status = CauseStatus.ACTIVE;
//        }
//        if (isFeatured == null) {
//            isFeatured = true;
//        }

        CauseSearchCriteria searchCriteria = CauseSearchCriteria.builder()
                .searchTerm(searchTerm)
                .status(CauseStatus.ACTIVE)
                .categoryId(categoryId)
                .organizationId(organizationId)
                .country(country)
                .isFeatured(true)
                .minAmount(minAmount)
                .maxAmount(maxAmount)
                .startDate(startDate)
                .endDate(endDate)
                .percentageToGoal(percentageToGoal)
                .daysToEnd(daysToEnd)
                .build();

        Sort.Direction direction = Sort.Direction.fromString(sortDirection);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(causeService.searchCausesWithFilters(searchCriteria, pageable));
    }

//    use if we want to update cause status manually using api but we already use scheduler to update cause status
//    @PostMapping("/update-statuses")
//    public ResponseEntity<ApiResponse<Void>> updateExpiredCauseStatuses() {
//        causeStatusUpdateService.updateCauseStatuses();
//        return ResponseEntity.ok(ApiResponse.success(null, "Cause statuses updated successfully"));
//    }

}