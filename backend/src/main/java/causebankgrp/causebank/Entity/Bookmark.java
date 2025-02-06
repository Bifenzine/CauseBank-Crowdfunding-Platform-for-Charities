package causebankgrp.causebank.Entity;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Document(collection = "bookmarks")
public class Bookmark {
    @Id
    private String id;
    @NotNull
    private UUID causeId;
    @NotNull
    private UUID userId;

    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

}