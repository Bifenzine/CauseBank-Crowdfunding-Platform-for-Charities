package causebankgrp.causebank.Services.PaymentServices;

import causebankgrp.causebank.Dto.StripeAccountDTO.StripeConnectAccountDTO;
import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Enums.StripeAccountStatus;
import causebankgrp.causebank.Exception.Auth_Authorize.ResourceNotFoundException;
import causebankgrp.causebank.Repository.OrganizationRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.Event;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationStripeService {
    private final StripeService stripeService;
    private final OrganizationRepository organizationRepository;

    // webhook secret
    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Transactional
    public Organization createStripeAccount(UUID organizationId, StripeConnectAccountDTO accountDTO)
            throws StripeException {
        log.info("Creating Stripe account for organization: {}", organizationId);

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        Account account = stripeService.createConnectAccount(accountDTO);
        organization.setStripeAccountId(account.getId());
        organization.setStripeAccountStatus(StripeAccountStatus.PENDING);

        Organization savedOrg = organizationRepository.save(organization);
        log.info("Created Stripe account {} for organization {}", account.getId(), organizationId);
        return savedOrg;
    }

    public String createAccountLink(UUID organizationId, String returnUrl) throws StripeException {
        log.info("Creating account link for organization: {}", organizationId);

        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (organization.getStripeAccountId() == null) {
            throw new IllegalStateException("Organization does not have a Stripe account");
        }

        AccountLink accountLink = stripeService.createAccountLink(
                organization.getStripeAccountId(),
                returnUrl
        );

        return accountLink.getUrl();
    }

    public StripeAccountStatus getAccountStatus(UUID organizationId) throws StripeException {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (organization.getStripeAccountId() == null) {
            return StripeAccountStatus.PENDING;
        }

        Account account = stripeService.retrieveAccount(organization.getStripeAccountId());
        return determineAccountStatus(account);
    }

    private StripeAccountStatus determineAccountStatus(Account account) {
        if (account.getChargesEnabled() && account.getPayoutsEnabled()) {
            return StripeAccountStatus.ACTIVE;
        } else if (account.getRequirements().getDisabledReason() != null) {
            return StripeAccountStatus.DISABLED;
        }
        return StripeAccountStatus.PENDING;
    }

    @Transactional
    public void handleWebhookEvent(String payload, String sigHeader) throws StripeException {
        log.info("Processing Stripe webhook event");

        Event event = stripeService.constructWebhookEvent(payload, sigHeader, webhookSecret);

        if ("account.updated".equals(event.getType())) {
            Account account = (Account) event.getData().getObject();
            updateOrganizationStripeStatus(account);
        }
    }

    private void updateOrganizationStripeStatus(Account account) {
        log.info("Updating organization status for Stripe account: {}", account.getId());

        Organization organization = organizationRepository.findByStripeAccountId(account.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found for Stripe account: " + account.getId()));

        StripeAccountStatus newStatus = determineAccountStatus(account);
        organization.setStripeAccountStatus(newStatus);

        organizationRepository.save(organization);
        log.info("Updated organization {} Stripe status to: {}", organization.getId(), newStatus);
    }
}

