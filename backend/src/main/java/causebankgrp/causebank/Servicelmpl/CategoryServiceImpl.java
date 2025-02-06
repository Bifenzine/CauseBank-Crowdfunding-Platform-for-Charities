package causebankgrp.causebank.Servicelmpl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import causebankgrp.causebank.Dto.CategoryDTO.Request.CategoryRequest;
import causebankgrp.causebank.Dto.CategoryDTO.Response.CategoryResponse;
import causebankgrp.causebank.Entity.Category;
import causebankgrp.causebank.Helpers.CategoryMapper;
import causebankgrp.causebank.Repository.CategoryRepository;
import causebankgrp.causebank.Services.CategoryService;
import causebankgrp.causebank.Utils.Auth_Authorize.AuthenticationUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final AuthenticationUtils authenticationUtils;

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        if (authenticationUtils.getCurrentAuthenticatedUser() == null) {
            log.error("User is not connected");
            throw new IllegalArgumentException("User is not connected");
        }


        if (!authenticationUtils.isCurrentUserAdmin()) {
            throw new IllegalArgumentException("Only admins can create categories");
        }

        if (categoryRepository.existsByNameIgnoreCase(categoryRequest.getName())) {
            throw new IllegalArgumentException("Category with this name already exists");
        }
        
        Category category = categoryMapper.toEntity(categoryRequest);
        return categoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(UUID id, CategoryRequest categoryRequest) {
        Category existingCategory = getCategoryEntity(id);

        if (authenticationUtils.isCurrentUserAdmin() == false) {
            throw new IllegalArgumentException("Only admins can update categories");
        }
        
        if (!existingCategory.getName().equalsIgnoreCase(categoryRequest.getName()) &&
            categoryRepository.existsByNameIgnoreCase(categoryRequest.getName())) {
            throw new IllegalArgumentException("Category with this name already exists");
        }
        
        categoryMapper.updateEntityFromDTO(categoryRequest, existingCategory);
        return categoryMapper.toDTO(categoryRepository.save(existingCategory));
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID id) {
        return categoryMapper.toDTO(getCategoryEntity(id));
    }

    @Override
    public void deleteCategory(UUID id) {
        if (authenticationUtils.isCurrentUserAdmin() == false) {
            throw new IllegalArgumentException("Only admins can delete categories");
        }
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(categoryMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> searchCategories(String searchTerm, Pageable pageable) {
        return categoryRepository.searchCategories(searchTerm, pageable).map(categoryMapper::toDTO);
    }

    @Override
    public boolean toggleActiveStatus(UUID id) {
        if (authenticationUtils.isCurrentUserAdmin() == false) {
            throw new IllegalArgumentException("Only admins can toggle category status");
        }
        Category category = getCategoryEntity(id);
        if(category == null) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        category.setIsActive(!category.getIsActive());
        categoryRepository.save(category);
        return category.getIsActive();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByIds(List<UUID> ids) {
        return categoryRepository.findByIdIn(ids)
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getCategoriesWithCauseCount(Pageable pageable) {
        return categoryRepository.findCategoriesWithCauseCount(pageable)
                .map(result -> {
                    CategoryResponse dto = categoryMapper.toDTO((Category) result[0]);
                    dto.setCauseCount((Long) result[1]);
                    return dto;
                });
    }

    private Category getCategoryEntity(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
    }
}