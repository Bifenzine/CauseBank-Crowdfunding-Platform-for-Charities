package causebankgrp.causebank.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Enums.UserRole;

import java.util.Optional;
import java.util.UUID;

// 4
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // updaterole
    @Modifying
    @Query("UPDATE User u SET u.role = :role WHERE u.id = :userId")
    void updateUserRole(@Param("userId") UUID userId, @Param("role") UserRole role);

    Optional<User> findUserById(UUID id);

    void deleteUserById(UUID id);

}
