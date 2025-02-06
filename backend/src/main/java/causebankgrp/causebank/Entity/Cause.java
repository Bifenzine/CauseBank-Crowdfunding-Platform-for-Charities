package causebankgrp.causebank.Entity;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import causebankgrp.causebank.Enums.CauseStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "causes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cause {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false , length = 500)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(length = 5000, columnDefinition = "TEXT")
    private String description;

    @Column(length = 1000 , columnDefinition = "TEXT")
    private String summary;

    @Column(name = "featured_image_url")
    private String featuredImageUrl;

    @Column(name = "goal_amount", nullable = false)
    private BigDecimal goalAmount;

    @Column(name = "current_amount")
    private BigDecimal currentAmount = BigDecimal.ZERO;

    @Column(name = "start_date", nullable = false)
    private ZonedDateTime startDate;

    @Column(name = "end_date")
    private ZonedDateTime endDate;

    @Enumerated(EnumType.STRING)
    private CauseStatus status = CauseStatus.DRAFT;

    @Column(name = "is_featured")
    private Boolean isFeatured = true;

    @Column(name = "donor_count")
    private Integer donorCount = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "cause_Country")
    private String causeCountry;


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