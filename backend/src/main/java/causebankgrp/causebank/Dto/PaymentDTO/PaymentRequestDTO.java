package causebankgrp.causebank.Dto.PaymentDTO;

import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.PaymentProvider;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    @NotNull
    private UUID causeId;

    private UUID donorId;

    @Positive
    private BigDecimal amount;
    private String currency = "USD";
    private PaymentProvider provider = PaymentProvider.STRIPE;
    private String successUrl;
    private String cancelUrl;
    private String description;

    private Boolean isAnonymous = false;

}
