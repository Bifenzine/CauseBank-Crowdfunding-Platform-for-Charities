package causebankgrp.causebank.Servicelmpl;

import causebankgrp.causebank.Dto.DonationDTO.Response.DonationResponseDTO;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Entity.Donation;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Helpers.AuthMapper;
import causebankgrp.causebank.Helpers.CauseMapper;
import causebankgrp.causebank.Helpers.DonationMapper;
import causebankgrp.causebank.Repository.CauseRepository;
import causebankgrp.causebank.Repository.DonationRepository;
import causebankgrp.causebank.Services.DonationService;
import causebankgrp.causebank.Services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final UserService userService;
    private final CauseMapper causeMapper;
    private final AuthMapper authMapper;
    private final CauseRepository causeRepository;

    @Override
    public ApiResponse<Page<DonationResponseDTO>> getAllDonations(Pageable pageable) {
        Page<Donation> donations = donationRepository.findAll(pageable);
        return ApiResponse.success(mapDonationPage(donations));
    }

    @Override
    public ApiResponse<Page<DonationResponseDTO>> getDonationsByCauseId(UUID causeId, Pageable pageable) {
        Page<Donation> donations = donationRepository.findByCauseId(causeId, pageable);
        return ApiResponse.success(mapDonationPage(donations));
    }

    @Override
    public ApiResponse<Page<DonationResponseDTO>> getDonationsByDonorId(UUID donorId, Pageable pageable) {
        Page<Donation> donations = donationRepository.findByDonor(donorId, pageable);
        return ApiResponse.success(mapDonationPage(donations));
    }

    private Page<DonationResponseDTO> mapDonationPage(Page<Donation> donations) {
        return donations.map(donation -> {
            DonationResponseDTO responseDTO = DonationMapper.toDonationResponseDTO(donation);

            // Fetch the cause and handle the case where it might not exist
            Optional<Cause> causeOptional = causeRepository.findById(donation.getCauseId());
            if (causeOptional.isPresent()) {
                responseDTO.setCause(causeMapper.toResponse(causeOptional.get()));
            } else {
                // Handle the case where the cause is not found
                responseDTO.setCause(null); // or set a default cause DTO
                log.warn("Cause not found for donation with ID: {}", donation.getId());
            }

            // Map donor data if not anonymous
            if (donation.getDonor() != null && !donation.getIsAnonymous()) {
                try {
                    User donor = userService.getUserById(donation.getDonor());
                    responseDTO.setDonor(authMapper.toUserDTO(donor));
                } catch (Exception e) {
                    // Handle case where user might not exist
                    responseDTO.setDonor(null);
                    log.warn("Donor not found for donation with ID: {}", donation.getId(), e);
                }
            }

            return responseDTO;
        });
    }
}
