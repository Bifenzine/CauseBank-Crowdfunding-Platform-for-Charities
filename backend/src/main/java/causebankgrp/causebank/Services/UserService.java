package causebankgrp.causebank.Services;

import java.util.List;
import java.util.UUID;

import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Models.UserModel;

public interface UserService {
    ApiResponse<UserModel> getUser(UUID id);

    ApiResponse<Void> deleteUser(UUID id);

    ApiResponse<UserModel> updateUserRole(UUID id, String role);

    ApiResponse<UserModel> updateUserById(UUID id, UserModel user);

    User getUserEntityByEmail(String email);

    ApiResponse<List<UserModel>> getAllUsers(int page, int size, String sortBy, String sortDir);

    User getUserById(UUID donor);
}
