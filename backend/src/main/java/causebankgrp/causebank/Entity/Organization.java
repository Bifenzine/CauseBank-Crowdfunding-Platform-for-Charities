package causebankgrp.causebank.Entity;

import causebankgrp.causebank.Enums.StripeAccountStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.hibernate.annotations.GenericGenerator;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "causes" })
@EqualsAndHashCode(exclude = { "causes" })
public class Organization {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Cause> causes = new HashSet<>();

    @Column(nullable = false)
    private String name;

    @Column(length = 5000 , columnDefinition = "TEXT")
    private String description;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "tax_id")
    private String taxId;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrganizationBankAccount> bankAccounts = new HashSet<>();

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    private String city;
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    private String country;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "stripe_account_id")
    private String stripeAccountId;

    @Column(name = "stripe_account_status")
    @Enumerated(EnumType.STRING)
    private StripeAccountStatus stripeAccountStatus = StripeAccountStatus.ACTIVE;


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
