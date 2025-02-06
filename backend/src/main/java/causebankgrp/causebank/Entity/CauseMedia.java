package causebankgrp.causebank.Entity;

import java.time.ZonedDateTime;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import causebankgrp.causebank.Enums.CauseMediaType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cause_media")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CauseMedia {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cause_id", nullable = false)
    private Cause cause;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false)
    private CauseMediaType mediaType; // Changed from String to CauseMediaType

    @Column(name = "media_url", nullable = false)
    private String mediaUrl;

    private String caption;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
    }
}