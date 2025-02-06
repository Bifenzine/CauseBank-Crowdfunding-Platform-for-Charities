package causebankgrp.causebank.Controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Models.UserModel;
import causebankgrp.causebank.Services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserControllers {

        private final UserService userService;

        @Operation(summary = "Get user by ID", description = "Retrieves a user by their ID")
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<UserModel>> getUser(
                        @PathVariable @Parameter(description = "User ID", required = true) UUID id) {
                ApiResponse<UserModel> response = userService.getUser(id);
                return ResponseEntity
                                .ok()
                                .body(response);
        }

        @GetMapping("/allUsers")
        @Operation(summary = "Get all users by Admin", description = "Retrieves all users with pagination and sorting")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<List<UserModel>>> getAllUsers(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(defaultValue = "createdAt") String sortBy,
                        @RequestParam(defaultValue = "desc") String sortDir) {

                ApiResponse<List<UserModel>> response = userService.getAllUsers(page, size, sortBy, sortDir);
                return ResponseEntity
                                .ok()
                                .body(response);
        }

        @Operation(summary = "Update user by ID", description = "Updates a user's details by ID")
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<UserModel>> updateUser(
                        @Parameter(description = "User ID", required = true) @PathVariable UUID id,
                        @RequestBody UserModel userModel) {
                ApiResponse<UserModel> response = userService.updateUserById(id, userModel);
                return ResponseEntity
                                .ok()
                                .body(response);
        }

        @Operation(summary = "Delete user by ID", description = "Deletes a user by their ID")
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteUser(
                        @PathVariable @Parameter(description = "User ID", required = true) UUID id) {
                ApiResponse<Void> response = userService.deleteUser(id);
                return ResponseEntity
                                .ok()
                                .body(response);
        }

        @Operation(summary = "Update user role by ID", description = "Updates a user's role by ID")
        @PatchMapping("/{id}/role")
        public ResponseEntity<ApiResponse<UserModel>> updateUserRole(
                        @PathVariable @Parameter(description = "User ID", required = true) UUID id,
                        @RequestParam String role) {
                ApiResponse<UserModel> response = userService.updateUserRole(id, role);
                return ResponseEntity
                                .ok()
                                .body(response);
        }
}
