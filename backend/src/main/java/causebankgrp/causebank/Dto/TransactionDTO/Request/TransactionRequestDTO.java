package causebankgrp.causebank.Dto.TransactionDTO.Request;

import causebankgrp.causebank.Enums.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequestDTO {
    private String donationId; // ID of the associated donation
    private String paymentProvider;
    private String paymentMethod;
    private String transactionRef;
    private BigDecimal amount;
    private BigDecimal feeAmount = BigDecimal.ZERO;
    private String currency;
    private TransactionStatus status = TransactionStatus.PENDING;
    private String errorMessage;
}
