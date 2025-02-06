package causebankgrp.causebank.Repository.EmailRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import causebankgrp.causebank.Entity.EmailConfirmationToken;
import causebankgrp.causebank.Entity.User;

@Repository
public interface EmailConfirmationTokenRepository extends JpaRepository<EmailConfirmationToken, String> {

    Optional<EmailConfirmationToken> findByToken(String token);

    void deleteByUser(User user);

    Optional<EmailConfirmationToken> findByUser(User user);
}
