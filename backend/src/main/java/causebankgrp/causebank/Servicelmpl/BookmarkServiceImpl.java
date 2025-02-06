package causebankgrp.causebank.Servicelmpl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import causebankgrp.causebank.Dto.BookmarkDTO.BookmarkDTO;
import causebankgrp.causebank.Dto.CausesDTO.Response.CauseResponse;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Entity.Bookmark;
import causebankgrp.causebank.Entity.Cause;
import causebankgrp.causebank.Entity.User;
import causebankgrp.causebank.Helpers.AuthMapper;
import causebankgrp.causebank.Helpers.CauseMapper;
import causebankgrp.causebank.Models.UserModel;
import causebankgrp.causebank.Repository.BookmarkRepository;
import causebankgrp.causebank.Services.BookmarkService;
import causebankgrp.causebank.Services.CauseService;
import causebankgrp.causebank.Services.UserService;
import causebankgrp.causebank.Utils.Auth_Authorize.AuthenticationUtils;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserService userService;
    private final CauseService causeService;
    private final AuthMapper authMapper;
    private final CauseMapper causeMapper;
    private final AuthenticationUtils authenticationUtils;

    @Override
    @Transactional
    public ApiResponse<List<BookmarkDTO>> getBookmarksByUserId(UUID userId) {
        try {
            // check if there is no bookmarks
            if (bookmarkRepository.countBookmarksByUserId(userId) == 0) {
                return ApiResponse.success(null, "No bookmarks found");
            }
            List<Bookmark> bookmarks = bookmarkRepository
                    .findBookmarksByUserId(userId, PageRequest.of(0, Integer.MAX_VALUE)).getContent();
            List<BookmarkDTO> bookmarkDTOs = bookmarks.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ApiResponse.success(bookmarkDTOs, "Bookmarks retrieved successfully");
        } catch (Exception e) {
            return ApiResponse.error("An error occurred in getBookmarksByUserId: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<List<BookmarkDTO>> getBookmarksByUserId(UUID userId, int page, int size) {
        try {
            // check if there is no bookmarks
            if (bookmarkRepository.countBookmarksByUserId(userId) == 0) {
                return ApiResponse.success(null, "No bookmarks found");
            }
            List<Bookmark> bookmarks = bookmarkRepository.findBookmarksByUserId(userId, PageRequest.of(page, size))
                    .getContent();
            List<BookmarkDTO> bookmarkDTOs = bookmarks.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ApiResponse.success(bookmarkDTOs, "Bookmarks retrieved successfully");
        } catch (Exception e) {
            return ApiResponse.error("An error occurred in getBookmarksByUserId: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<BookmarkDTO> addBookmark(UUID causeId) {
        log.debug("Starting addBookmark method for causeId: {}", causeId);

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            log.debug("Current authentication: {}", auth);
            log.debug("Authentication principal: {}", auth != null ? auth.getPrincipal() : "null");
            log.debug("Authentication authorities: {}", auth != null ? auth.getAuthorities() : "null");

            UUID userId = authenticationUtils.getCurrentAuthenticatedUserId();
            log.debug("Retrieved userId: {}", userId);

            ApiResponse<UserModel> userResponse = userService.getUser(userId);
            ApiResponse<CauseResponse> causeResponse = causeService.getCauseById(causeId);

            if (!userResponse.isSuccess() || userResponse.getData() == null) {
                return ApiResponse.error("User not found");
            }
            if (!causeResponse.isSuccess() || causeResponse.getData() == null) {
                return ApiResponse.error("Cause not found");
            }

            if (bookmarkRepository.existsByUserIdAndCauseId(userId, causeId)) {
                return ApiResponse.error("Bookmark already exists");
            }

            User user = authMapper.responseToUser(userResponse.getData());
            Cause cause = causeMapper.responseToCause(causeResponse.getData());

            Bookmark bookmark = new Bookmark();
            bookmark.setUserId(userId);
            bookmark.setCauseId(causeId);
            bookmarkRepository.save(bookmark);

            BookmarkDTO bookmarkDTO = convertToDTO(bookmark);
            return ApiResponse.success(bookmarkDTO, "Bookmark added successfully");
        } catch (Exception e) {
            return ApiResponse.error("An error occurred in addBookmark: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ApiResponse<Void> removeBookmark(UUID causeId) {
        log.debug("Starting removeBookmark method for causeId: {}", causeId);
        try {
            UUID userId = authenticationUtils.getCurrentAuthenticatedUserId();
            if (userId == null) {
                return ApiResponse.error("User is not authenticated");
            }
            log.debug("Retrieved userId: {}", userId);

            if (!bookmarkRepository.existsByUserIdAndCauseId(userId, causeId)) {
                return ApiResponse.error("Bookmark not found for user and cause");
            }
            log.debug("Bookmark found for userId: {} and causeId: {}. Proceeding to remove.", userId, causeId);

            // Deleting the bookmark associated with this user and cause
            bookmarkRepository.deleteBookmarkByCauseId(causeId);
            return ApiResponse.success(null, "Bookmark removed successfully");
        } catch (Exception e) {
            log.error("Error removing bookmark and causeId: {}", causeId, e);
            return ApiResponse.error("Could not remove the bookmark. Please try again later.");
        }
    }

    private BookmarkDTO convertToDTO(Bookmark bookmark) {
        UUID causeId = bookmark.getCauseId();
        CauseResponse cause = causeService.getCauseById(causeId).getData();
        return new BookmarkDTO(
                bookmark.getId(),
                bookmark.getUserId(),
                cause.getId(),
                cause.getTitle(),
                cause.getFeaturedImageUrl(),
                cause.getDescription(),
                cause.getGoalAmount(),
                cause.getCurrentAmount(),
                cause.getEndDate(),
                cause.getStatus(),
                cause.getDonorCount(),
                cause.getViewCount(),
                cause.getCountry(),
                cause.getCategory(),
                cause.getOrganization(),
                bookmark.getCreatedAt(),
                bookmark.getUpdatedAt());
    }

}