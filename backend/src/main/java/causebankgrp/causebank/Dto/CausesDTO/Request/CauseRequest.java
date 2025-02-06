package causebankgrp.causebank.Dto.CausesDTO.Request;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

import causebankgrp.causebank.Dto.CauseMediaDTO.Request.CauseMediaRequest;
import causebankgrp.causebank.Enums.CauseStatus;
import org.springframework.validation.annotation.Validated;

// import causebankgrp.causebank.Dto.CauseMediaDTO.Request.CauseMediaRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Validated
public class CauseRequest {
    @NotNull(message = "Organization ID is required")
    private UUID organizationId;
    @NotNull(message = "Category ID is required")
    private UUID categoryId;
    @NotNull
    @Size(min = 2, max = 255, message = "Title must be between 2 and 100 characters")

    @NotNull
    private String title;
    private String slug;
    @NotNull
    private String description;
    @NotNull
    private String summary;
    //@NotNull
    private String featuredImageUrl;
    @NotNull
    private String country;
    @NotNull
    @Positive
    private BigDecimal goalAmount;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Boolean isFeatured;
    private CauseStatus status;
    @NotNull
    private UUID userId;
    private List<CauseMediaRequest> causeMedia; // Added field
}
