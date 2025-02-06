package causebankgrp.causebank.Controllers;

import causebankgrp.causebank.Dto.OrganizationDTO.Request.OrganizationRequest;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.OrganizationResponse;
import causebankgrp.causebank.Dto.StripeAccountDTO.StripeConnectAccountDTO;
import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Enums.StripeAccountStatus;
import causebankgrp.causebank.Services.OrganizationService;
import causebankgrp.causebank.Services.CloudinaryService.CloudinaryService;
import causebankgrp.causebank.Services.PaymentServices.OrganizationStripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organization")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Organization Management", description = "APIs for managing organizations")
@SecurityRequirement(name = "JWT")
public class OrganizationControllers {

    private final OrganizationService organizationService;
    private final OrganizationStripeService organizationStripeService;

    @Operation(summary = "Create a new organization")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
            @Valid @RequestPart("organization") OrganizationRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo) {
        return ResponseEntity.ok(organizationService.createOrganization(request, logo));
    }

    @Operation(summary = "Update organization")
    @PutMapping(value = "/{id}",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @Parameter(description = "Organization ID", required = true)
            @PathVariable UUID id,
            @Valid @RequestPart("organization") OrganizationRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo) {
        log.atInfo().log("Updating organization: {}", request);
        log.atInfo().log("Logo: {}", logo);
        log.atInfo().log("ID: {}", id);

        return ResponseEntity.ok(organizationService.updateOrganization(id, request, logo));
    }

    @Operation(summary = "Delete organization")
    // tested with postman : working only author and all the causes of the
    // organization are deleted too
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganization(
            @Parameter(description = "Organization ID", required = true) @PathVariable UUID id) {
        ApiResponse<Void> response = organizationService.deleteOrganization(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get organization by ID")
    // tested with postman : working all users
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganization(
            @Parameter(description = "Organization ID", required = true) @PathVariable UUID id) {
        ApiResponse<OrganizationResponse> response = organizationService.getOrganization(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get user organizations")
    // tested with postman : working only authenticated user if he has an
    // organization
    @GetMapping("/userOrganizations/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getUserOrganizations(
            @Parameter(description = "User ID", required = true) @PathVariable UUID id
    ) {
        ApiResponse<OrganizationResponse> response = organizationService.getUserOrganizations(id);
        return ResponseEntity.ok(response);

    }

    @Operation(summary = "Get all organizations")
    // tested with postman : working all users
    @GetMapping("/allOrganizations")
    public ResponseEntity<ApiResponse<List<OrganizationResponse>>> getAllOrganizations() {
        ApiResponse<List<OrganizationResponse>> response = organizationService.getAllOrganizations();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "verify organization")
    // tested with postman : working only admin
    @PatchMapping("/verify/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> verifyOrganization(
            @PathVariable @Parameter(description = "Organization ID", required = true) UUID id) {
        ApiResponse<OrganizationResponse> response = organizationService.verifyOrganization(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "unverify organization")
    // tested with postman : working only admin
    @PatchMapping("/unverify/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> unverifyOrganization(
            @PathVariable @Parameter(description = "Organization ID", required = true) UUID id) {
        ApiResponse<OrganizationResponse> response = organizationService.unverifyOrganization(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Create Stripe Connect account for organization")
    // tested with postman : working only for organizations
    @PostMapping("/{id}/connect/account")
    public ResponseEntity<ApiResponse<OrganizationResponse>> createConnectAccount(
            @Parameter(description = "Organization ID", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody StripeConnectAccountDTO accountDTO) {
        log.atInfo().log("Creating Stripe Connect account for organization: {}", id);
        try {
            Organization organization = organizationStripeService.createStripeAccount(id, accountDTO);
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Stripe Connect account created successfully",
                    OrganizationResponse.fromEntity(organization)
            ));
        } catch (StripeException e) {
            log.error("Failed to create Stripe account", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false,
                    "Failed to create Stripe account: " + e.getMessage(),
                    null
            ));
        }
    }

    @Operation(summary = "Get Stripe Connect account onboarding link")
    // tested with postman : working only for organizations
    @GetMapping("/{id}/connect/account-link")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAccountLink(
            @Parameter(description = "Organization ID", required = true)
            @PathVariable UUID id,
            @Parameter(description = "Return URL after onboarding")
            @RequestParam(required = false) String returnUrl) {
        log.atInfo().log("Generating account link for organization: {}", id);
        try {
            String accountLinkUrl = organizationStripeService.createAccountLink(id, returnUrl);
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Account link generated successfully",
                    Map.of("url", accountLinkUrl)
            ));
        } catch (StripeException e) {
            log.error("Failed to generate account link", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false,
                    "Failed to generate account link: " + e.getMessage(),
                    null
            ));
        }
    }

    @Operation(summary = "Get Stripe Connect account status")
    // postman status : working only for organizations
    @GetMapping("/{id}/connect/account-status")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAccountStatus(
            @Parameter(description = "Organization ID", required = true)
            @PathVariable UUID id) throws StripeException {
        log.atInfo().log("Checking account status for organization: {}", id);
        StripeAccountStatus status = organizationStripeService.getAccountStatus(id);
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Account status retrieved successfully",
                Map.of("status", status.toString())
        ));
    }

    @Operation(summary = "Handle Stripe Connect webhook events")
    // postman status : not tested
    @PostMapping("/connect/webhook")
    public ResponseEntity<ApiResponse<Void>> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        log.atInfo().log("Received Stripe webhook event");
        try {
            organizationStripeService.handleWebhookEvent(payload, sigHeader);
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Webhook processed successfully",
                    null
            ));
        } catch (Exception e) {
            log.error("Failed to process webhook", e);
            return ResponseEntity.internalServerError().body(new ApiResponse<>(
                    false,
                    "Failed to process webhook",
                    null
            ));
        }
    }
}