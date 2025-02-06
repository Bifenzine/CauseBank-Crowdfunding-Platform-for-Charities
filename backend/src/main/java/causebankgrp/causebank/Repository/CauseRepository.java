package causebankgrp.causebank.Repository;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Enums.CauseStatus;

@Repository
public interface CauseRepository extends JpaRepository<Cause, UUID> , JpaSpecificationExecutor<Cause> {

       // Find by slug with eager loading of organization and category
       @Query("SELECT c FROM Cause c LEFT JOIN FETCH c.organization LEFT JOIN FETCH c.category WHERE c.slug = :slug")
       Optional<Cause> findBySlugWithDetails(@Param("slug") String slug);

       // Find active causes by organization
       Page<Cause> findByOrganizationId(UUID organizationId, Pageable pageable);

       // Find active causes by organization
       @Query("SELECT c FROM Cause c WHERE c.organization.id = :organizationId AND c.status = ACTIVE OR c.status = COMPLETED AND isFeatured = true")
       Page<Cause> findActiveCausesByOrganizationId(@Param("organizationId") UUID organizationId, Pageable pageable);

       // Find by category
       Page<Cause> findByCategoryId(UUID categoryId, Pageable pageable);

       // Find featured causes
       Page<Cause> findByIsFeaturedTrueAndStatus(CauseStatus status, Pageable pageable);

//       find all countries
       @Query("SELECT DISTINCT c.causeCountry FROM Cause c WHERE c.status = :status")
       List<String> findAllCountries(@Param("status") CauseStatus status);

       // Find causes by status
       Page<Cause> findByStatus(CauseStatus status, Pageable pageable);



       // Search causes by title or description
       @Query("SELECT c FROM Cause c WHERE " +
                     "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
                     "c.status = :status")
       Page<Cause> searchCauses(@Param("searchTerm") String searchTerm,
                     @Param("status") CauseStatus status,
                     Pageable pageable);

       // Find causes close to goal amount
       @Query("SELECT c FROM Cause c WHERE c.status = :status AND " +
                     "((c.goalAmount - c.currentAmount) / c.goalAmount) * 100 <= :percentageRemaining")
       List<Cause> findCausesNearGoal(@Param("status") CauseStatus status,
                     @Param("percentageRemaining") double percentageRemaining);

       // Update current amount
       @Modifying
       @Query("UPDATE Cause c SET c.currentAmount = c.currentAmount + :amount, " +
                     "c.donorCount = c.donorCount + 1 WHERE c.id = :causeId")
       void updateCurrentAmountAndDonorCount(@Param("causeId") UUID causeId,
                     @Param("amount") BigDecimal amount);

       // Increment view count
       @Modifying(clearAutomatically = true)
       @Query("UPDATE Cause c SET c.viewCount = c.viewCount + 1 WHERE c.id = :causeId")
       void incrementViewCount(@Param("causeId") UUID causeId);

       // Find causes ending soon
       @Query("SELECT c FROM Cause c WHERE c.status = :status AND " +
                     "c.endDate BETWEEN :now AND :endDate")
       List<Cause> findCausesEndingSoon(@Param("status") CauseStatus status,
                     @Param("now") ZonedDateTime now,
                     @Param("endDate") ZonedDateTime endDate);



       // Check if slug exists
       boolean existsBySlug(String slug);

       // findcausesbyCauseCountry
       Page<Cause> findByCauseCountry(String causeCountry, Pageable pageable);

       // Search causes with filters
       @Query("SELECT DISTINCT c FROM Cause c " +
               "LEFT JOIN FETCH c.organization o " +
               "LEFT JOIN FETCH c.category cat " +
               "WHERE (:searchTerm IS NULL OR " +
               "      LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
               "      LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
               "AND (:status IS NULL OR c.status = :status) " +
               "AND (:categoryId IS NULL OR c.category.id = :categoryId) " +
               "AND (:organizationId IS NULL OR c.organization.id = :organizationId) " +
               "AND (:country IS NULL OR c.causeCountry = :country) " +
               "AND (:isFeatured IS NULL OR c.isFeatured = :isFeatured) " +
               "AND (:minAmount IS NULL OR c.currentAmount >= :minAmount) " +
               "AND (:maxAmount IS NULL OR c.currentAmount <= :maxAmount) " +
               "AND (:startDate IS NULL OR c.endDate >= :startDate) " +
               "AND (:endDate IS NULL OR c.endDate <= :endDate)")
       Page<Cause> searchCausesWithFilters(
               @Param("searchTerm") String searchTerm,
               @Param("status") CauseStatus status,
               @Param("categoryId") UUID categoryId,
               @Param("organizationId") UUID organizationId,
               @Param("country") String country,
               @Param("isFeatured") Boolean isFeatured,
               @Param("minAmount") BigDecimal minAmount,
               @Param("maxAmount") BigDecimal maxAmount,
               @Param("startDate") ZonedDateTime startDate,
               @Param("endDate") ZonedDateTime endDate,
               Pageable pageable
       );


       // get id cause and check if the goal amount is reached
       @Query("SELECT c FROM Cause c WHERE c.id = :causeId AND c.currentAmount >= c.goalAmount")
       Optional<Cause> checkAndUpdateGoalStatus(@Param("causeId") UUID causeId);

       // get id cause and check end date
       @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Cause c WHERE c.id = :causeId AND c.endDate <= :now")
       boolean isCauseExpired(@Param("causeId") UUID causeId, @Param("now") ZonedDateTime now);

//       find expired cause
       @Query("SELECT c FROM Cause c WHERE c.id = :causeId AND c.endDate <= :now")
       Optional<Cause> findExpiredCause(@Param("causeId") UUID causeId, @Param("now") ZonedDateTime now);


       // get all causes that have ended to change status
       @Query("SELECT c FROM Cause c WHERE c.endDate < :now AND c.status <> 'COMPLETED'")
       List<Cause> findByEndDateBeforeAndStatusNot(@Param("now") ZonedDateTime now);


}
