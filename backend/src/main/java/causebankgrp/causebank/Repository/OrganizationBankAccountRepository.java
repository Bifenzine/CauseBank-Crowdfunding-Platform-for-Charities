package causebankgrp.causebank.Repository;

import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Entity.OrganizationBankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganizationBankAccountRepository extends JpaRepository<OrganizationBankAccount, UUID> {
    Optional<OrganizationBankAccount> findByOrganizationAndIsPrimaryTrue(Organization organization);
    List<OrganizationBankAccount> findAllByOrganization(Organization organization);
    boolean existsByOrganizationAndIsPrimaryTrue(Organization organization);
}
