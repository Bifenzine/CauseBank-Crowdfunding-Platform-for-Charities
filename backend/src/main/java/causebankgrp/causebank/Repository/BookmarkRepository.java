package causebankgrp.causebank.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import causebankgrp.causebank.Entity.Bookmark;

@Repository
public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
    Page<Bookmark> findBookmarksByUserId(UUID userId, Pageable pageable);

    void deleteBookmarkByCauseId(UUID causeId);

    void deleteBookmarkById(String id);

    long countBookmarksByUserId(UUID userId);

    Optional<Bookmark> findByUserIdAndCauseId(UUID userId, UUID causeId);

    boolean existsByUserIdAndCauseId(UUID userId, UUID causeId);

    void deleteAllByCauseId(UUID causeId);
}
