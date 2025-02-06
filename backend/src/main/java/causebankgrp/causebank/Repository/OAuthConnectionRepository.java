package causebankgrp.causebank.Repository;

import causebankgrp.causebank.Entity.OAuthConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuthConnectionRepository extends JpaRepository<OAuthConnection, Long> {
    Optional<OAuthConnection> findByProviderAndProviderId(String provider, String providerId);
}
