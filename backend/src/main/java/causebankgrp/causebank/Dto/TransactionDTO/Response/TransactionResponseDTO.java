package causebankgrp.causebank.Dto.TransactionDTO.Response;

import causebankgrp.causebank.Enums.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {
    private UUID id;
    private String donationId;
    private String paymentProvider;
    private String paymentMethod;
    private String transactionRef;
    private BigDecimal amount;
    private BigDecimal feeAmount;
    private String currency;
    private TransactionStatus status;
    private String errorMessage;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}

