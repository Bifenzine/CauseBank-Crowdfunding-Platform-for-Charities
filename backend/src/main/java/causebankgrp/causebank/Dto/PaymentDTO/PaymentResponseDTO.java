package causebankgrp.causebank.Dto.PaymentDTO;

import causebankgrp.causebank.Enums.PaymentProvider;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private String clientSecret;  // For Stripe
    private String paymentId;     // For PayPal
    private String approvalUrl;   // For PayPal
    private PaymentProvider provider;
    private String status;
    private BigDecimal adjustedAmount;
    @NotNull
    private UUID donationId;


}