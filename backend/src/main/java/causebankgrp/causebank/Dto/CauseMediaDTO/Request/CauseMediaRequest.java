package causebankgrp.causebank.Dto.CauseMediaDTO.Request;

import java.util.UUID;

import causebankgrp.causebank.Enums.CauseMediaType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CauseMediaRequest {
    private UUID causeId;
    //@NotNull(message = "Media type is required")
    private CauseMediaType mediaType; // Changed from String to CauseMediaType
    private String mediaUrl;
    private String caption;
    //@NotNull(message = "Display order must not be null")
    private Integer displayOrder;
}