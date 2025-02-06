package causebankgrp.causebank.Helpers;

import causebankgrp.causebank.Dto.AuthDTO.Response.UserDTO;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Models.UserModel;

import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    public UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId() != null ? user.getId().toString() : null)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .isEmailVerified(Boolean.TRUE.equals(user.getIsEmailVerified()))
                .isPhoneVerified(Boolean.TRUE.equals(user.getIsPhoneVerified()))
                .build();
    }

    public User toEntity(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setAvatarUrl(userDTO.getAvatarUrl());
        return user;
    }

    public User responseToUser(UserModel userModel) {
        User user = new User();
        user.setId(userModel.getId());
        user.setEmail(userModel.getEmail());
        user.setFirstName(userModel.getFirstName());
        user.setLastName(userModel.getLastName());
        return user;
    }
}