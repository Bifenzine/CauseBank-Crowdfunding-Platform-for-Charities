package causebankgrp.causebank.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import causebankgrp.causebank.Entity.CauseMedia;

@Repository
public interface CauseMediaRepository extends JpaRepository<CauseMedia, UUID> {
    
    @Modifying
    @Query("DELETE FROM CauseMedia cm WHERE cm.cause.id = :causeId")
    void deleteByCauseId(@Param("causeId") UUID causeId);

    // Add this method to your repository
    @Query("SELECT MAX(cm.displayOrder) FROM CauseMedia cm WHERE cm.cause.id = :causeId")
    Optional<Integer> findMaxDisplayOrderByCauseId(@Param("causeId") UUID causeId);


    List<CauseMedia> findByCauseId(UUID causeId);

    // delete cause media by cause id

    void deleteById(UUID causeMediaId);
}