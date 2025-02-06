package causebankgrp.causebank.Dto.AuthDTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String avatarUrl;
    private String phone;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
}

