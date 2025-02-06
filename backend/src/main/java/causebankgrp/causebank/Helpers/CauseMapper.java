package causebankgrp.causebank.Helpers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import causebankgrp.causebank.Dto.CausesDTO.Request.CauseRequest;
import causebankgrp.causebank.Dto.CausesDTO.Response.CauseResponse;
import causebankgrp.causebank.Entity.Cause;

@Mapper(componentModel = "spring", uses = { OrganizationMapper.class, CategoryMapper.class })
public interface CauseMapper {

    @Mapping(source = "organization.id", target = "organization.id")
    @Mapping(source = "organization.name", target = "organization.name")
    @Mapping(source = "organization.description", target = "organization.description")
    @Mapping(source = "organization.websiteUrl", target = "organization.websiteUrl")
    @Mapping(source = "organization.logoUrl", target = "organization.logoUrl")
    @Mapping(source = "organization.registrationNumber", target = "organization.registrationNumber")
    @Mapping(source = "organization.taxId", target = "organization.taxId")
    @Mapping(source = "organization.addressLine1", target = "organization.addressLine1")
    @Mapping(source = "organization.addressLine2", target = "organization.addressLine2")
    @Mapping(source = "organization.city", target = "organization.city")
    @Mapping(source = "organization.state", target = "organization.state")
    @Mapping(source = "organization.postalCode", target = "organization.postalCode")
    @Mapping(source = "organization.country", target = "organization.country")
    @Mapping(source = "organization.isVerified", target = "organization.isVerified")
    @Mapping(source = "organization.createdAt", target = "organization.createdAt")
    @Mapping(source = "organization.updatedAt", target = "organization.updatedAt")
    @Mapping(source = "organization.user.id", target = "organization.userId")
    // @Mapping(source = "organization.user.fullName", target =
    // "organization.userFullName")
    @Mapping(source = "organization.user.role", target = "organization.userRole")

    @Mapping(source = "category.id", target = "category.id")
    @Mapping(source = "category.name", target = "category.name")
    @Mapping(source = "category.description", target = "category.description")
    @Mapping(source = "category.iconUrl", target = "category.iconUrl")
    @Mapping(source = "category.isActive", target = "category.isActive")
    @Mapping(source = "category.createdAt", target = "category.createdAt")
    @Mapping(source = "category.updatedAt", target = "category.updatedAt")
    @Mapping(source = "causeCountry", target = "country")
    // @Mapping(source = "category.causeCount", target = "category.causeCount")
    CauseResponse toResponse(Cause cause);

    @Mapping(target = "organization", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "currentAmount", ignore = true)
    @Mapping(target = "donorCount", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "causeCountry", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateCauseFromRequest(CauseRequest causeRequest, @MappingTarget Cause cause);

    default Cause requestToCause(CauseRequest causeRequest) {
        if (causeRequest == null) {
            return null;
        }

        Cause cause = new Cause();
        updateCauseFromRequest(causeRequest, cause);
        return cause;
    }

    // New method to convert CauseResponse to Cause
    default Cause responseToCause(CauseResponse causeResponse) {
        if (causeResponse == null) {
            return null;
        }

        Cause cause = new Cause();
        cause.setId(causeResponse.getId());
        cause.setTitle(causeResponse.getTitle());
        cause.setSlug(causeResponse.getSlug());
        cause.setDescription(causeResponse.getDescription());
        cause.setCurrentAmount(causeResponse.getCurrentAmount());
        cause.setDonorCount(causeResponse.getDonorCount());
        cause.setViewCount(causeResponse.getViewCount());
        cause.setStatus(causeResponse.getStatus());
        cause.setEndDate(causeResponse.getEndDate());
        cause.setGoalAmount(causeResponse.getGoalAmount());
        cause.setCauseCountry(causeResponse.getCountry());

        // Map other fields as necessary
        return cause;
    }
}
