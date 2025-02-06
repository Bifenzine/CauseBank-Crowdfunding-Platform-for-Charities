package causebankgrp.causebank.Dto.CausesDTO.Response;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;
import causebankgrp.causebank.Dto.CategoryDTO.Response.CategoryResponse;
// import causebankgrp.causebank.Dto.CauseMediaDTO.Response.CauseMediaResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.OrganizationResponse;
import causebankgrp.causebank.Enums.CauseStatus;
import lombok.Data;

@Data
public class CauseResponse {
    private UUID id;
    private OrganizationResponse organization;
    private CategoryResponse category;
    private String title;
    private String slug;
    private String description;
    private String summary;
    private String featuredImageUrl;
    private BigDecimal goalAmount;
    private BigDecimal currentAmount;
    private String country;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private CauseStatus status;
    private Boolean isFeatured;
    private Integer donorCount;
    private Integer viewCount;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    // private List<CauseMediaResponse> causeMedia; // Added field

}
