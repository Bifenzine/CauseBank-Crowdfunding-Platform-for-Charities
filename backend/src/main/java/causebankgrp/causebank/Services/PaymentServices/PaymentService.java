package causebankgrp.causebank.Services.PaymentServices;

import causebankgrp.causebank.Dto.PaymentDTO.PaymentRequestDTO;
import causebankgrp.causebank.Dto.PaymentDTO.PaymentResponseDTO;
import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Entity.Donation;
import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Entity.Transaction;
import causebankgrp.causebank.Enums.*;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Repository.CauseRepository;
import causebankgrp.causebank.Repository.DonationRepository;
import causebankgrp.causebank.Repository.PaymentRepository.PaymentRepository;
import causebankgrp.causebank.Utils.Auth_Authorize.AuthenticationUtils;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;
    private final CauseRepository causeRepository;
    private final DonationRepository donationRepository;
    private final AuthenticationUtils authUtils;


    public PaymentResponseDTO initiatePayment(PaymentRequestDTO request) throws StripeException {
        // Check if cause is completed
        if(causeRepository.checkAndUpdateGoalStatus(request.getCauseId()).isPresent()) {
            log.info("Cause is already completed");
            throw new IllegalStateException("Cause is already completed");
        }

        // Check if cause is expired
        if (causeRepository.isCauseExpired(request.getCauseId(), ZonedDateTime.now())) {
            throw new IllegalStateException("Cause is already expired");
        }

        // Get cause and validate amount
        Optional<Cause> actualCauseOpt = causeRepository.findById(request.getCauseId());
        if (actualCauseOpt.isEmpty()) {
            throw new IllegalStateException("Cause not found");
        }

        Cause actualCause = actualCauseOpt.get();
        BigDecimal remainingAmount = actualCause.getGoalAmount().subtract(actualCause.getCurrentAmount());

        // Validate and adjust amount if necessary
        BigDecimal finalAmount = request.getAmount().min(remainingAmount);
        if (finalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Cause goal has already been reached");
        }
        if (request.getAmount().compareTo(BigDecimal.valueOf(999999)) > 0) {
            throw new IllegalStateException("Maximum donation amount is $999,999");
        }

        // Update request amount to the adjusted amount
        request.setAmount(finalAmount);

        Donation donation = createDonation(request);
        log.info("Initiating payment for donation: {}", donation.getId());

        Organization organization = actualCause.getOrganization();
        log.info("Organization: {}", organization);

        if (organization.getStripeAccountId() == null ||
                organization.getStripeAccountStatus() != StripeAccountStatus.PENDING) {
            throw new IllegalStateException("Organization is not properly set up with Stripe");
        }

        PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                finalAmount,
                request.getCurrency(),
                request.getDescription(),
                request.getIsAnonymous(),
                request.getDonorId(),
                request.getCauseId(),
                organization.getStripeAccountId()
        );

        Transaction transaction = createTransaction(donation, paymentIntent);

        return PaymentResponseDTO.builder()
                .clientSecret(paymentIntent.getClientSecret())
                .provider(PaymentProvider.STRIPE)
                .status(TransactionStatus.PENDING.toString())
                .donationId(donation.getId())
                .adjustedAmount(finalAmount)  // Add this to inform frontend if amount was adjusted
                .build();
    }


    private Donation createDonation(PaymentRequestDTO request) {


        log.info("request donation for cause: {}", request);
        Donation donation = new Donation();

        donation.setCauseId(causeRepository.findById(request.getCauseId())
                .orElseThrow(() -> new ResourceNotFoundException("Cause not found")).getId());
        donation.setAmount(request.getAmount());
        donation.setStatus(DonationStatus.PENDING);
        donation.setDescription(request.getDescription());
        log.atDebug().log("payment request is anonymous: {}", request);
        donation.setIsAnonymous(request.getIsAnonymous());
        if (request.getDonorId() != null) {
            donation.setDonor(authUtils.getCurrentAuthenticatedUserId());
        } else {
            donation.setDonor(null);
        }

        return donationRepository.save(donation);
    }

    private Transaction createTransaction(Donation donation, PaymentIntent paymentIntent) {
        Transaction transaction = new Transaction();
        transaction.setDonationId(donation.getId());
        transaction.setPaymentProvider(PaymentProvider.STRIPE.toString());
        transaction.setTransactionRef(paymentIntent.getId());
        transaction.setAmount(donation.getAmount());
        transaction.setFeeAmount(BigDecimal.valueOf(paymentIntent.getApplicationFeeAmount()));
        transaction.setCurrency(paymentIntent.getCurrency().toUpperCase());
        transaction.setStatus(TransactionStatus.PENDING);
        return paymentRepository.save(transaction);
    }



    public void handleWebhookEvent(String payload, String sigHeader) throws StripeException {
        log.info("Webhook secret being used: {}", webhookSecret);

        try {
        Event event = stripeService.constructWebhookEvent(payload, sigHeader, webhookSecret);

        log.info("Constructed webhook event: {}", event.getType());

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
            handleSuccessfulPayment(paymentIntent);
        } else if ("payment_intent.payment_failed".equals(event.getType())) {
            PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
            handleFailedPayment(paymentIntent);
        }

        } catch (StripeException e) {
            log.error("Error processing webhook event: {}", e.getMessage());
        }
    }

    private void handleSuccessfulPayment(PaymentIntent paymentIntent) {
        Transaction transaction = paymentRepository.findByTransactionRef(paymentIntent.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transaction.setStatus(TransactionStatus.SUCCESSFUL);
        UUID donation = transaction.getDonationId();
        Optional<Donation> actualDonation = donationRepository.findById(donation);
        actualDonation.get().setStatus(DonationStatus.COMPLETED);

        // Update cause's current amount
        Optional<Cause> cause = causeRepository.findById(actualDonation.get().getCauseId());

        cause.get().setCurrentAmount(cause.get().getCurrentAmount().add(actualDonation.get().getAmount()));
        cause.get().setDonorCount(cause.get().getDonorCount() + 1);
        if (cause.get().getCurrentAmount().compareTo(cause.get().getGoalAmount()) >= 0) {
            cause.get().setStatus(CauseStatus.COMPLETED);
        }

        paymentRepository.save(transaction);
        donationRepository.save(actualDonation.get());
        causeRepository.save(cause.get());
    }


    private void handleFailedPayment(PaymentIntent paymentIntent) {
        Transaction transaction = paymentRepository.findByTransactionRef(paymentIntent.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transaction.setStatus(TransactionStatus.FAILED);
        transaction.setErrorMessage(paymentIntent.getLastPaymentError().getMessage());

        UUID donation = transaction.getDonationId();
        Optional<Donation> actualDonation = donationRepository.findById(donation);
        actualDonation.get().setStatus(DonationStatus.FAILED);

        paymentRepository.save(transaction);
        donationRepository.save(actualDonation.get());
    }
}

