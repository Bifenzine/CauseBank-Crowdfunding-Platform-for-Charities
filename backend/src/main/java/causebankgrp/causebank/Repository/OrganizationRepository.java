package causebankgrp.causebank.Repository;

import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    // Find organization by its name
    Optional<Organization> findByName(String name);

    // Check if an organization with a specific name already exists
    boolean existsByName(String name);

    // Find organizations by user ID
    Organization findByUser_Id(UUID userId);

    // Find organizations by user
    List<Organization> findByUser(User user);

    // Find organization by registration number
    Optional<Organization> findByRegistrationNumber(String registrationNumber);

    // Check if an organization exists with a specific registration number
    boolean existsByRegistrationNumber(String registrationNumber);

    // Find organizations by city
    List<Organization> findByCity(String city);

    // Find organizations by country
    List<Organization> findByCountry(String country);

    // Count organizations by user
    long countByUser(User user);

    // Find organizations with verification status
    List<Organization> findByIsVerified(Boolean isVerified);

    Optional<Organization> findByStripeAccountId(String stripeAccountId);


}