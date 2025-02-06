package causebankgrp.causebank.Helpers;

import causebankgrp.causebank.Entity.Organization;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Dto.OrganizationDTO.Request.OrganizationRequest;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.OrganizationResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrganizationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "user", source = "authUser")
    @Mapping(target = "name", expression = "java(determineOrganizationName(requestDTO, authUser))")
    Organization toEntity(OrganizationRequest requestDTO, User authUser);

    @Mapping(target = "userId", source = "user.id")
    // @Mapping(target = "userFullName", expression = "java(getUserFullName(organization))")
    @Mapping(target = "userRole", source = "user.role")
    OrganizationResponse toResponseDTO(Organization organization);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    void updateEntity(@MappingTarget Organization existingOrganization, OrganizationRequest requestDTO);

    // Helper methods
    default String determineOrganizationName(OrganizationRequest requestDTO, User authUser) {
        return requestDTO.getName() != null ? requestDTO.getName() : 
            (authUser.getFirstName() + " " + authUser.getLastName());
    }

    default String getUserFullName(Organization organization) {
        if (organization.getUser() == null) {
            return null;
        }
        return organization.getUser().getFirstName() + " " + organization.getUser().getLastName();
    }
}