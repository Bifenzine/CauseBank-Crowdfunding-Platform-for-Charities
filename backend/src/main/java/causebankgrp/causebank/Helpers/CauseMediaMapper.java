package causebankgrp.causebank.Helpers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import causebankgrp.causebank.Dto.CauseMediaDTO.Request.CauseMediaRequest;
import causebankgrp.causebank.Dto.CauseMediaDTO.Response.CauseMediaResponse;
import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Entity.CauseMedia;

@Mapper(componentModel = "spring")
public interface CauseMediaMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "cause", source = "cause")
    CauseMedia toEntity(CauseMediaRequest request, Cause cause);

    @Mapping(target = "causeId", source = "cause.id")
    CauseMediaResponse toResponse(CauseMedia causeMedia);
}
