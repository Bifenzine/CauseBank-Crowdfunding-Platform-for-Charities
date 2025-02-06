package causebankgrp.causebank.Controllers;

import causebankgrp.causebank.Dto.CauseMediaDTO.Response.CauseMediaResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Services.CauseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/causes/media")
@RequiredArgsConstructor
@Tag(name = "Cause Management", description = "APIs for managing charitable causes")
@SecurityRequirement(name = "JWT")
public class CauseMediaControllers {

    private final CauseService causeService;

    @Operation(summary = "Get all cause media by cause id")
    @GetMapping(value = "/{causeId}")
    @Parameter(name = "causeId", description = "The cause id", required = true)
    public ResponseEntity<ApiResponse<List<CauseMediaResponse>>> getAllCauseMediaByCauseId(@PathVariable UUID causeId) {
        List<CauseMediaResponse> causeMediaResponses = causeService.getCauseMediaByCauseId(causeId);
        return ResponseEntity.ok(ApiResponse.success(causeMediaResponses));
    }
}
