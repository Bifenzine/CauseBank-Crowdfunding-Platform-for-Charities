package causebankgrp.causebank.Dto.CauseSearchCriteriaDTO;

import causebankgrp.causebank.Enums.CauseStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class CauseSearchCriteria {
    private String searchTerm;
    private CauseStatus status;
    private UUID categoryId;
    private UUID organizationId;
    private String country;
    private Boolean isFeatured;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Double percentageToGoal;
    private Integer daysToEnd;
}
