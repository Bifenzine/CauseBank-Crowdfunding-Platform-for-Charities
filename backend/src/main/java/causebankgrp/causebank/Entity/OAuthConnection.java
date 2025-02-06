package causebankgrp.causebank.Entity;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "oauth_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String providerId;

    @Column(nullable = false)
    private String provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String email;

    private String name;
    private String avatarUrl;

    @Column(length = 2048)
    private String accessToken;

    @Column(length = 2048)
    private String refreshToken;

    @Column(name = "expires_at")
    private Instant expiresAt;
}
