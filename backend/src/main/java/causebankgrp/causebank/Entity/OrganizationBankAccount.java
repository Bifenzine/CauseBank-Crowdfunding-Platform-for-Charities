package causebankgrp.causebank.Entity;

import causebankgrp.causebank.Enums.BankAccountType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "organization_bank_accounts")
@Getter
@Setter
@NoArgsConstructor
public class OrganizationBankAccount {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "account_holder_name", nullable = false)
    private String accountHolderName;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "routing_number")
    private String routingNumber;

    @Column(name = "swift_code")
    private String swiftCode;

    @Column(name = "iban")
    private String iban;

    @Column(name = "account_type")
    @Enumerated(EnumType.STRING)
    private BankAccountType accountType;

    @Column(name = "is_primary")
    private Boolean isPrimary = true;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

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



