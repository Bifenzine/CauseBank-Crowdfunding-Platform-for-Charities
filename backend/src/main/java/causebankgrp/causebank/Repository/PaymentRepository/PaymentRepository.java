package causebankgrp.causebank.Repository.PaymentRepository;

import causebankgrp.causebank.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Transaction, UUID> {
    Optional<Transaction> findByTransactionRef(String transactionRef);
   // List<Transaction> findByDonation_Cause_Id(UUID causeId);
}
