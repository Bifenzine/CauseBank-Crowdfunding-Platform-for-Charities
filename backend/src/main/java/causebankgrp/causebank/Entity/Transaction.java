package causebankgrp.causebank.Entity;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.GenericGenerator;

import causebankgrp.causebank.Enums.TransactionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotNull
    @Column(name = "donation_id", nullable = false)
    private UUID donationId;

    @Column(name = "payment_provider", nullable = false)
    private String paymentProvider;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "transaction_ref", unique = true)
    private String transactionRef;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "fee_amount")
    private BigDecimal feeAmount = BigDecimal.ZERO;

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }
}
