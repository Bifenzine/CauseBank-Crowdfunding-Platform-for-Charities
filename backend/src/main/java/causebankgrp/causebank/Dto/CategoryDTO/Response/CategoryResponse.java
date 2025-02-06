package causebankgrp.causebank.Dto.CategoryDTO.Response;

import java.time.ZonedDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryResponse {
    private UUID id;
    private String name;
    private String description;
    private String iconUrl;
    private Boolean isActive;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private Long causeCount;
}
