package causebankgrp.causebank.Dto.DonationDTO.Response;

import causebankgrp.causebank.Dto.AuthDTO.Response.UserDTO;
import causebankgrp.causebank.Dto.CausesDTO.Response.CauseResponse;
import causebankgrp.causebank.Enums.DonationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationResponseDTO {
    private UUID id;
    private CauseResponse cause;
    private UserDTO donor;
    private BigDecimal amount;
    private DonationStatus status;
    private String message;
    private Boolean isAnonymous;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
