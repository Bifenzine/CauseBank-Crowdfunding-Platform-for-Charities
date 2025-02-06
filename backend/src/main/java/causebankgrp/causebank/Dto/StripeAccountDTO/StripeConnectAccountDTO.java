package causebankgrp.causebank.Dto.StripeAccountDTO;

import causebankgrp.causebank.Dto.StripeAccountDTO.BusinessProfileDTO.BusinessProfileDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StripeConnectAccountDTO {
    private String email;
    private String country;
    private String businessType; // individual or company
    private BusinessProfileDTO businessProfile;
    private String returnUrl;
}
