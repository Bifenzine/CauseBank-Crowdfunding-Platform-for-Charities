package causebankgrp.causebank.Dto.AuthDTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UserDTO user;
}
