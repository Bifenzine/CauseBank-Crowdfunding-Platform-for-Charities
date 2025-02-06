package causebankgrp.causebank.Helpers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.mapstruct.NullValuePropertyMappingStrategy;

import causebankgrp.causebank.Dto.CategoryDTO.Request.CategoryRequest;
import causebankgrp.causebank.Dto.CategoryDTO.Response.CategoryResponse;
import causebankgrp.causebank.Entity.Category;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    @Mapping(target = "causeCount", ignore = true)
    CategoryResponse toDTO(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "iconUrl", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "causeCount", ignore = true)
    Category toEntity(CategoryRequest categoryRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "iconUrl", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "causeCount", ignore = true)
    void updateEntityFromDTO(CategoryRequest categoryRequest, @MappingTarget Category category);
}