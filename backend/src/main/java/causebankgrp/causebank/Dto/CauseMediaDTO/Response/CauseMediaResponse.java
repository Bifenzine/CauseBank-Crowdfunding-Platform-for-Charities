package causebankgrp.causebank.Dto.CauseMediaDTO.Response;

import java.time.ZonedDateTime;
import java.util.UUID;

import causebankgrp.causebank.Enums.CauseMediaType;
import lombok.Data;

@Data
public class CauseMediaResponse {
    private UUID id;
    private UUID causeId;
    private CauseMediaType mediaType; // Changed from String to CauseMediaType
    private String mediaUrl;
    private String caption;
    private Integer displayOrder;
    private ZonedDateTime createdAt;
}
