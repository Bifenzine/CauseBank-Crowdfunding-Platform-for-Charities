package causebankgrp.causebank.Services;


import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import causebankgrp.causebank.Dto.CategoryDTO.Request.CategoryRequest;
import causebankgrp.causebank.Dto.CategoryDTO.Response.CategoryResponse;


public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest);
    CategoryResponse updateCategory(UUID id, CategoryRequest categoryRequest);
    CategoryResponse getCategoryById(UUID id);
    void deleteCategory(UUID id);
    
    List<CategoryResponse> getAllActiveCategories();
    Page<CategoryResponse> getAllCategories(Pageable pageable);
    Page<CategoryResponse> searchCategories(String searchTerm, Pageable pageable);
    
    boolean toggleActiveStatus(UUID id);
    List<CategoryResponse> getCategoriesByIds(List<UUID> ids);
    Page<CategoryResponse> getCategoriesWithCauseCount(Pageable pageable);
}
