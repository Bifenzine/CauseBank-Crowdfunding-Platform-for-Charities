package causebankgrp.causebank.Dto.StripeAccountDTO.BusinessProfileDTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfileDTO {
    private String name;
    private String url;
    private String mcc; // Merchant Category Code
    private String taxId;
}
