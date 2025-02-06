package causebankgrp.causebank.Dto.DonationDTO.Request;

import causebankgrp.causebank.Enums.DonationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequestDTO {
    private String causeId;  // ID of the associated cause
    private String donorId;  // ID of the donor
    private BigDecimal amount;
    private DonationStatus status = DonationStatus.PENDING;
    private String message;
    private Boolean isAnonymous = true;
}
