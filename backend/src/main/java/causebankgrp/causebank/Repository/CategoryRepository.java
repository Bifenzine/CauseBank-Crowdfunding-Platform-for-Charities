package causebankgrp.causebank.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import causebankgrp.causebank.Entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    
    // Find active categories
    List<Category> findByIsActiveTrue();
    
    // Find by name (case insensitive)
    Optional<Category> findByNameIgnoreCase(String name);
    
    // Search categories
    @Query("SELECT c FROM Category c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Category> searchCategories(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find categories with causes count
    @Query("SELECT c, COUNT(cs) FROM Category c " +
           "LEFT JOIN Cause cs ON c.id = cs.category.id " +
           "GROUP BY c.id")
    Page<Object[]> findCategoriesWithCauseCount(Pageable pageable);
    
    // Check if name exists (case insensitive)
    boolean existsByNameIgnoreCase(String name);
    
    // Find categories by multiple IDs
    List<Category> findByIdIn(List<UUID> ids);
}
