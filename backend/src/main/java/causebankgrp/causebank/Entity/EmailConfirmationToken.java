package causebankgrp.causebank.Entity;

import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.ReadOnlyProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfirmationToken {
    @Id
    private String id;
    private String token;
    @CreatedDate
    @ReadOnlyProperty
    private LocalDate createdAt;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    // Add expiration time field
    private LocalDateTime expiryDate;

}
