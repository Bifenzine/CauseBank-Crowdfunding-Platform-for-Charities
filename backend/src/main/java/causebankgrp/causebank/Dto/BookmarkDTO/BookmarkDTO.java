package causebankgrp.causebank.Dto.BookmarkDTO;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

import causebankgrp.causebank.Dto.CategoryDTO.Response.CategoryResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.OrganizationResponse;
import jakarta.persistence.Column;
import org.springframework.validation.annotation.Validated;

import causebankgrp.causebank.Enums.CauseStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Validated
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkDTO {
    private String id;
    @NotNull
    private UUID userId;
    @NotNull
    private UUID causeId;
    private String title;
    private String featuredImageUrl;
    private String description;
    private BigDecimal goalAmount;
    private BigDecimal currentAmount;
    private ZonedDateTime endDate;
    private CauseStatus status;
    private Integer donorCount;
    private Integer viewCount;
    private String causeCountry;
    private CategoryResponse causeCategory;
    private OrganizationResponse organization;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
