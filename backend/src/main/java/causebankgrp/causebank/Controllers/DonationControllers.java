package causebankgrp.causebank.Controllers;

import causebankgrp.causebank.Dto.DonationDTO.Response.DonationResponseDTO;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Services.DonationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/donations")
@RequiredArgsConstructor
@Tag(name = "Donations", description = "Donation management APIs")
public class DonationControllers {

    private final DonationService donationService;

    @GetMapping
//    tested in postman : working
    @Operation(summary = "Get all donations", description = "Retrieve all donations with pagination")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Page<DonationResponseDTO>>> getAllDonations(
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(donationService.getAllDonations(pageable));
    }

    @GetMapping("/cause/{causeId}")
    @Operation(summary = "Get donations by cause", description = "Retrieve all donations for a specific cause")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Page<DonationResponseDTO>>> getDonationsByCause(
            @PathVariable UUID causeId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(donationService.getDonationsByCauseId(causeId, pageable));
    }

    @GetMapping("/donor/{donorId}")
    @Operation(summary = "Get donations by donor", description = "Retrieve all donations made by a specific donor")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Page<DonationResponseDTO>>> getDonationsByDonor(
            @PathVariable UUID donorId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(donationService.getDonationsByDonorId(donorId, pageable));
    }
}
