package causebankgrp.causebank.Models;

// 2
import causebankgrp.causebank.Enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String avatarUrl;
    private String phone;
    private String passwordHash;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
    private Boolean isActive;
    private ZonedDateTime lastLoginAt;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}