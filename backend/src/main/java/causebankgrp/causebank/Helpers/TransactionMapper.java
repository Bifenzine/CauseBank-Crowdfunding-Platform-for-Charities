package causebankgrp.causebank.Helpers;

import causebankgrp.causebank.Entity.Transaction;
import causebankgrp.causebank.Dto.TransactionDTO.Request.TransactionRequestDTO;
import causebankgrp.causebank.Dto.TransactionDTO.Response.TransactionResponseDTO;
import causebankgrp.causebank.Entity.Donation;


public class TransactionMapper {

    // Map Transaction entity to TransactionResponseDTO
    public static TransactionResponseDTO toTransactionResponseDTO(Transaction transaction) {
        return new TransactionResponseDTO(
            transaction.getId(),
            transaction.getDonationId().toString(),
            transaction.getPaymentProvider(),
            transaction.getPaymentMethod(),
            transaction.getTransactionRef(),
            transaction.getAmount(),
            transaction.getFeeAmount(),
            transaction.getCurrency(),
            transaction.getStatus(),
            transaction.getErrorMessage(),
            transaction.getCreatedAt(),
            transaction.getUpdatedAt()
        );
    }

    // Map TransactionRequestDTO to Transaction entity
    public static Transaction toTransactionEntity(TransactionRequestDTO dto, Donation donation) {
        return new Transaction(
            null, // ID will be auto-generated
            donation.getId(),
            dto.getPaymentProvider(),
            dto.getPaymentMethod(),
            dto.getTransactionRef(),
            dto.getAmount(),
            dto.getFeeAmount(),
            dto.getCurrency(),
            dto.getStatus(),
            dto.getErrorMessage(),
            null, // Created at will be set by JPA
            null  // Updated at will be set by JPA
        );
    }
}
