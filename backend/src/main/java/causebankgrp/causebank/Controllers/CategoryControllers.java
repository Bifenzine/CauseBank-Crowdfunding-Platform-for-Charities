package causebankgrp.causebank.Controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import causebankgrp.causebank.Dto.CategoryDTO.Request.CategoryRequest;
import causebankgrp.causebank.Dto.CategoryDTO.Response.CategoryResponse;
import causebankgrp.causebank.Services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Category Management", description = "APIs for managing cause categories")
@SecurityRequirement(name = "JWT")
public class CategoryControllers {

    private final CategoryService categoryService;

    @Operation(
        summary = "Create a new category",
        description = "Creates a new category for causes"
    )
    // tested with postman : working only admin
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody @Valid CategoryRequest categoryRequest) {
        return new ResponseEntity<>(categoryService.createCategory(categoryRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Update a category")
    // tested with postman : working only admin
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID id,
            @RequestBody @Valid CategoryRequest categoryRequest) {
        return ResponseEntity.ok(categoryService.updateCategory(id, categoryRequest));
    }

    @Operation(summary = "Get category by ID")
    @GetMapping("/{id}")
    // tested with postman : working all users
    public ResponseEntity<CategoryResponse> getCategoryById(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @Operation(summary = "Get active categories")
    // tested with postman : working all users
    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getAllActiveCategories() {
        return ResponseEntity.ok(categoryService.getAllActiveCategories());
    }

    @Operation(summary = "Search categories")
    // not tested
    @GetMapping("/search")
    public ResponseEntity<Page<CategoryResponse>> searchCategories(
            @Parameter(description = "Search term", required = true)
            @RequestParam String searchTerm,
            Pageable pageable) {
        return ResponseEntity.ok(categoryService.searchCategories(searchTerm, pageable));
    }

    @Operation(summary = "Toggle category status")
    // tested with postman : working only admin
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Boolean> toggleActiveStatus(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.toggleActiveStatus(id));
    }

    @Operation(summary = "delete category by ID")
    // removed from postman instead we desactivate the category :only admin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "Category ID", required = true)
            @PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
        }   
}
