package causebankgrp.causebank.Services;

import causebankgrp.causebank.Dto.DonationDTO.Response.DonationResponseDTO;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface DonationService {

    ApiResponse<Page<DonationResponseDTO>> getAllDonations(Pageable pageable);

    ApiResponse<Page<DonationResponseDTO>> getDonationsByCauseId(UUID causeId, Pageable pageable);

    ApiResponse<Page<DonationResponseDTO>> getDonationsByDonorId(UUID donorId, Pageable pageable);
}
