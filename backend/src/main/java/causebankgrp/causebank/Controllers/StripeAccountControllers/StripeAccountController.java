package causebankgrp.causebank.Controllers.StripeAccountControllers;


import causebankgrp.causebank.Dto.StripeAccountDTO.StripeAccountDTO;
import causebankgrp.causebank.Services.PaymentServices.StripeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stripe/")
@RequiredArgsConstructor
@Slf4j
public class StripeAccountController {

    private final StripeService stripeService;

    @Operation(summary = "Get connected account data")
    @GetMapping("/account/{accountId}")
    public ResponseEntity<StripeAccountDTO> getAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(stripeService.getAccountData(accountId));
    }
}
