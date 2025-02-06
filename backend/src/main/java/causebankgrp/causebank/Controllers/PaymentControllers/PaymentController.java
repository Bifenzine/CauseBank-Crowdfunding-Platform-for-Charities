package causebankgrp.causebank.Controllers.PaymentControllers;

import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Dto.PaymentDTO.PaymentRequestDTO;
import causebankgrp.causebank.Dto.PaymentDTO.PaymentResponseDTO;
import causebankgrp.causebank.Services.PaymentServices.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments/")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> createPaymentIntent(
            @Valid @RequestBody PaymentRequestDTO request) {
        log.info("Creating payment intent for amount: {}", request.getAmount());
        try {
            PaymentResponseDTO response = paymentService.initiatePayment(request);
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Payment intent created successfully",
                    response
            ));
        } catch (StripeException e) {
            log.error("Failed to create payment intent", e);
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false,
                    "Failed to create payment intent: " + e.getMessage(),
                    null
            ));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature" , required = false) String sigHeader) {
        log.info("WEBHOOK RECEIVED");
        log.info("Payload: {}", payload);
        log.info("Signature Header: {}", sigHeader);
        try {
            if (sigHeader == null) {
                log.error("No Stripe signature found in header");
                return ResponseEntity.badRequest().build();
            }
            paymentService.handleWebhookEvent(payload, sigHeader);
            log.info("Successfully processed webhook");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing webhook", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}