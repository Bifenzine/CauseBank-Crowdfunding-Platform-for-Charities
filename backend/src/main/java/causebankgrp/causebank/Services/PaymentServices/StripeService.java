package causebankgrp.causebank.Services.PaymentServices;

import causebankgrp.causebank.Dto.StripeAccountDTO.StripeAccountDTO;
import causebankgrp.causebank.Dto.StripeAccountDTO.StripeAccountDTO.*;
import causebankgrp.causebank.Dto.StripeAccountDTO.StripeConnectAccountDTO;
import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Repository.CauseRepository;
import causebankgrp.causebank.Repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.connect.return.url}")
    private String defaultReturnUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    private final UserRepository userRepository;
    private final CauseRepository causeRepository;

    public Account createConnectAccount(StripeConnectAccountDTO accountDTO) throws StripeException {
        log.info("Creating Stripe Connect Express account for: {}", accountDTO.getEmail());

        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setCountry(accountDTO.getCountry())
                .setEmail(accountDTO.getEmail())
                .setCapabilities(
                        AccountCreateParams.Capabilities.builder()
                                .setCardPayments(AccountCreateParams.Capabilities.CardPayments.builder()
                                        .setRequested(true)
                                        .build())
                                .setTransfers(AccountCreateParams.Capabilities.Transfers.builder()
                                        .setRequested(true)
                                        .build())
                                .build()
                )
                .setBusinessType(AccountCreateParams.BusinessType.valueOf(accountDTO.getBusinessType().toUpperCase()))
                .setBusinessProfile(AccountCreateParams.BusinessProfile.builder()
                        .setName(accountDTO.getBusinessProfile().getName())
                        .setUrl(accountDTO.getBusinessProfile().getUrl())
                        .setMcc(accountDTO.getBusinessProfile().getMcc())
                        .build())
                .build();

        return Account.create(params);
    }

    public AccountLink createAccountLink(String accountId, String returnUrl) throws StripeException {
        log.info("Creating account link for Stripe account: {}", accountId);

        String finalReturnUrl = returnUrl != null ? returnUrl : defaultReturnUrl;

        AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                .setAccount(accountId)
                .setRefreshUrl(finalReturnUrl)
                .setReturnUrl(finalReturnUrl)
                .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                .setCollect(AccountLinkCreateParams.Collect.EVENTUALLY_DUE)
                .build();

        AccountLink accountLink = AccountLink.create(params);
        log.info("Created account link: {}", accountLink.getUrl());
        return accountLink;
    }

    public Event constructWebhookEvent(String payload, String sigHeader, String webhookSecret) throws StripeException {
        return Webhook.constructEvent(payload, sigHeader, webhookSecret);
    }

    public Account retrieveAccount(String accountId) throws StripeException {
        return Account.retrieve(accountId);
    }

    // Add this new method for creating payment intents
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, String description, boolean isAnonymous,
                                             UUID donorId, UUID causeId, String organizationStripeAccountId)
            throws StripeException {
        log.info("Creating payment intent for organization {}: {} {}",
                organizationStripeAccountId, amount, currency);

        // Convert amount to cents/smallest currency unit as Stripe expects amounts in smallest currency unit
        Long amountInSmallestUnit = amount.multiply(new BigDecimal("100")).longValue();

        // Calculate platform fee (5% in this example)
        Long applicationFeeAmount = (long)(amountInSmallestUnit * 0.05);

        // Handle donor information
        String donorInfo = "Anonymous";
        if (!isAnonymous && donorId != null) {
            donorInfo = userRepository.findById(donorId)
                    .map(user -> user.getFirstName() + " " + user.getLastName())
                    .orElse("Anonymous");
        }

        // Get cause name
        String causeName = causeRepository.findById(causeId)
                .map(Cause::getTitle)
                .orElse("");
        log.info("Creating payment intent with cause name: {}", causeName);

        // Update description to include both donor's info and cause name
        String updatedDescription = String.format("%s - Donor: %s - Cause: %s",
                description, donorInfo, causeName);

        PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                .setAmount(amountInSmallestUnit)
                .setCurrency(currency.toLowerCase())
                .setDescription(updatedDescription)
                .putMetadata("causeName", causeName)
                .setApplicationFeeAmount(applicationFeeAmount)
                .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                                .setDestination(organizationStripeAccountId)
                                .build()
                )
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                );

        // Only add donor metadata if donorId is not null
        if (donorId != null) {
            paramsBuilder.putMetadata("donorId", donorId.toString());
        }

        // Add causeId metadata if it's not null
        if (causeId != null) {
            paramsBuilder.putMetadata("causeId", causeId.toString());
        }

        PaymentIntentCreateParams params = paramsBuilder.build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        log.info("Created payment intent with metadata: {}", paymentIntent.getMetadata());
        log.info("Created payment intent: {}", paymentIntent.getId());

        return paymentIntent;
    }


    public StripeAccountDTO getAccountData(String accountId) {
        log.atDebug().log("Getting account data for Stripe account : {}", accountId);
        try {
            Stripe.apiKey = stripeSecretKey;

            // Get account information
            Account account = Account.retrieve(accountId);

            // Get balance information
            Balance balance = Balance.retrieve(
                    RequestOptions.builder().setStripeAccount(accountId).build()
            );
            log.atDebug().log("Balance: {}", balance);

            // Get recent balance transactions
            BalanceTransactionListParams balanceTransactionParams = BalanceTransactionListParams.builder()
                    .setLimit(10L)
                    .build();

            // Get recent charges (transactions)
            ChargeListParams chargeParams = ChargeListParams.builder()
                    .setLimit(10L)  // Optional: Specify number of transactions
//                    .addExpand("data.metadata")  // Add this line to expand metadata
                    .build();
            List<Charge> charges = Charge.list(chargeParams,
                    RequestOptions.builder().setStripeAccount(accountId).build()).getData();

            // Get recent payments (Payment Intents)
            PaymentIntentListParams paymentIntentParams = PaymentIntentListParams.builder()
                    .setLimit(10L)  // Optional: Specify number of payments
                    .build();
            List<PaymentIntent> payments = PaymentIntent.list(paymentIntentParams, RequestOptions.builder().setStripeAccount(accountId).build()).getData();

            // Get recent payouts
            PayoutListParams payoutParams = PayoutListParams.builder()
                    .setLimit(10L)  // Optional: Specify number of payouts
                    .build();
            List<Payout> payouts = Payout.list(payoutParams, RequestOptions.builder().setStripeAccount(accountId).build()).getData();

            // Initialize DTO
            StripeAccountDTO dto = new StripeAccountDTO();
            dto.setId(account.getId());
            dto.setEmail(account.getEmail());

            // Map balance
            BalanceData balanceData = new BalanceData();
            balanceData.setAvailable(balance.getAvailable().get(0).getAmount());
            balanceData.setInstantAvailable(balance.getInstantAvailable().get(0).getAmount());
            balanceData.setPending(balance.getPending().get(0).getAmount());
            balanceData.setCurrency(balance.getAvailable().get(0).getCurrency());
            dto.setBalance(balanceData);
//            log.atDebug().log("Balance data: {}", balanceData);

            // Map business profile
            if (account.getBusinessProfile() != null) {
                BusinessProfile profile = new BusinessProfile();
                profile.setName(account.getBusinessProfile().getName());
                profile.setUrl(account.getBusinessProfile().getUrl());
                dto.setBusinessProfile(profile);
            }

            // Map payout schedule
            if (account.getSettings() != null && account.getSettings().getPayouts() != null) {
                PayoutSchedule schedule = new PayoutSchedule();
                schedule.setInterval(account.getSettings().getPayouts().getSchedule().getInterval());
                schedule.setDelayDays(Math.toIntExact(account.getSettings().getPayouts().getSchedule().getDelayDays()));
                dto.setPayoutSchedule(schedule);
            }

            // Map recent transactions
            dto.setRecentTransactions(
                    Stream.concat(
                            charges.stream().map(this::mapCharge),
                            Stream.concat(
                                    payments.stream().map(this::mapPayment),
                                    payouts.stream().map(this::mapPayout)
                            )
                    ).collect(Collectors.toList())
            );

            return dto;

        } catch (StripeException e) {
            throw new RuntimeException("Error getting Stripe account dat: " + e.getMessage());
        }
    }

    private Transaction mapCharge(Charge charge) {
        Transaction transaction = new Transaction();
        transaction.setId(charge.getId());
        transaction.setType("charge");
        transaction.setAmount(charge.getAmount());
        transaction.setCurrency(charge.getCurrency());
        transaction.setStatus(charge.getStatus());
        transaction.setCreated(charge.getCreated());

        // Get donor and cause info from metadata
        String donorInfo = "Anonymous";
        String causeName = "";

//        log.info("Charge ID: {} - Original Description: {}", charge.getId(), charge.getDescription());
//        log.info("Charge Metadata: {}", charge.getMetadata() != null ? charge.getMetadata().toString() : "null");

        // First try to get from metadata
        if (charge.getMetadata() != null && !charge.getMetadata().isEmpty()) {
//            log.info("Metadata keys: {}", charge.getMetadata().keySet());

            if (charge.getMetadata().containsKey("donorId")) {
                String donorId = charge.getMetadata().get("donorId");
//                log.info("Found donorId in metadata: {}", donorId);
                donorInfo = getDonorInfo(UUID.fromString(donorId));
            }

            if (charge.getMetadata().containsKey("causeId")) {
                String causeId = charge.getMetadata().get("causeId");
//                log.info("Found causeId in metadata: {}", causeId);
                causeName = charge.getMetadata().get("causeName");
            }
        }

        // If we couldn't get from metadata, try to parse from description
        if (causeName.isEmpty() && charge.getDescription() != null) {
            String desc = charge.getDescription();
            if (desc.contains("Cause:")) {
                causeName = desc.substring(desc.indexOf("Cause:") + 6).trim();
//                log.info("Extracted cause name from description: {}", causeName);
            }
        }

        // Format amount properly
        String formattedAmount = formatAmount(charge.getAmount());

        // Create description with donor and cause info
        StringBuilder description = new StringBuilder(String.format("Donation of %s %s - Donor: %s",
                formattedAmount,
                charge.getCurrency().toUpperCase(),
                donorInfo));

        if (!causeName.isEmpty()) {
            description.append(" - Cause: ").append(causeName);
        }

        String finalDescription = description.toString();
//        log.info("Final transaction description: {}", finalDescription);

        transaction.setDescription(finalDescription);
        return transaction;
    }

    private Transaction mapPayment(PaymentIntent payment) {
        Transaction transaction = new Transaction();
        transaction.setId(payment.getId());
        transaction.setType("payment");
        transaction.setAmount(payment.getAmountReceived());
        transaction.setCurrency(payment.getCurrency());
        transaction.setStatus(payment.getStatus());
        transaction.setCreated(payment.getCreated());

        // Get donor and cause info from metadata
        String donorInfo = "Anonymous";
        String causeName = "";

        if (payment.getMetadata() != null) {
            if (payment.getMetadata().containsKey("donorId")) {
                String donorId = payment.getMetadata().get("donorId");
                donorInfo = getDonorInfo(UUID.fromString(donorId));
            }
            if (payment.getMetadata().containsKey("causeId")) {
                String causeId = payment.getMetadata().get("causeId");
                causeName = getCauseName(UUID.fromString(causeId));
            }
        }

        // Format amount properly
        String formattedAmount = formatAmount(payment.getAmountReceived());

        // Create description with donor and cause info
        String description = String.format("Payment of %s %s - Donor: %s",
                formattedAmount,
                payment.getCurrency().toUpperCase(),
                donorInfo);

        if (!causeName.isEmpty()) {
            description += " - Cause: " + causeName;
        }

        transaction.setDescription(description);
        return transaction;
    }

    private Transaction mapPayout(Payout payout) {
        Transaction transaction = new Transaction();
        transaction.setId(payout.getId());
        transaction.setType("payout");
        transaction.setAmount(payout.getAmount());
        transaction.setCurrency(payout.getCurrency());
        transaction.setStatus(payout.getStatus());
        transaction.setCreated(payout.getCreated());

        // Format amount properly
        String formattedAmount = formatAmount(payout.getAmount());

        String description = String.format("Payout of %s %s to bank account ending in %s",
                formattedAmount,
                payout.getCurrency().toUpperCase(),
                payout.getDestination() != null ?
                        payout.getDestination().substring(Math.max(0, payout.getDestination().length() - 4)) :
                        "unknown");

        transaction.setDescription(description);
        return transaction;
    }

    private String getDonorInfo(UUID donorId) {
        return userRepository.findById(donorId)
                .map(user -> user.getFirstName() + " " + user.getLastName())
                .orElse("Anonymous");
    }

    private String getCauseName(UUID causeId) {
//        log.info("Getting cause name for ID: {}", causeId);
        String name = causeRepository.findById(causeId)
                .map(Cause::getTitle)
                .orElse("");
//        log.info("Retrieved cause name: {}", name);
        return name;
    }

    private String formatAmount(Long amount) {
        // Convert cents to dollars with proper decimal formatting
        BigDecimal decimal = new BigDecimal(amount)
                .divide(new BigDecimal(100))
                .setScale(2, RoundingMode.HALF_UP);
        return decimal.toString();
    }
}
