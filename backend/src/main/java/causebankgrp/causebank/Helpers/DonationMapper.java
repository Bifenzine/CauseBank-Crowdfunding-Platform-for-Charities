package causebankgrp.causebank.Helpers;

import causebankgrp.causebank.Dto.DonationDTO.Request.DonationRequestDTO;
import causebankgrp.causebank.Dto.DonationDTO.Response.DonationResponseDTO;
import causebankgrp.causebank.Entity.Donation;
import causebankgrp.causebank.Enums.DonationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DonationMapper {

    // Map Donation entity to DonationResponseDTO
    public static DonationResponseDTO toDonationResponseDTO(Donation donation) {
        if (donation == null) {
            return null;
        }

        return new DonationResponseDTO(
                donation.getId(),
                null, // CauseResponse will be set by service
                null, // UserDTO will be set by service
                donation.getAmount(),
                donation.getStatus(),
                donation.getDescription(),
                donation.getIsAnonymous(),
                donation.getCreatedAt(),
                donation.getUpdatedAt()
        );
    }

    // Map DonationRequestDTO to Donation entity
    public static Donation toDonationEntity(DonationRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Donation donation = new Donation();
        donation.setAmount(dto.getAmount());
        donation.setStatus(DonationStatus.PENDING); // Set default status
        donation.setDescription(dto.getMessage());
        donation.setIsAnonymous(dto.getIsAnonymous());
        return donation;
    }
}
