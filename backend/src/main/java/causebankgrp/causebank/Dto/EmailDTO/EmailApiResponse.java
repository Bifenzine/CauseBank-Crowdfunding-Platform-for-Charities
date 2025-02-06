package causebankgrp.causebank.Dto.EmailDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailApiResponse {
    private boolean success;
    private String message;
}
