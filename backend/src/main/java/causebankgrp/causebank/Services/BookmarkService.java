package causebankgrp.causebank.Services;

import java.util.List;
import java.util.UUID;

import causebankgrp.causebank.Dto.BookmarkDTO.BookmarkDTO;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;

 public interface BookmarkService {
     // Return type should be List<BookmarkDTO> for getting bookmarks
    ApiResponse<List<BookmarkDTO>> getBookmarksByUserId(UUID userId);

    // For pagination support
    ApiResponse<List<BookmarkDTO>> getBookmarksByUserId(UUID userId, int page, int size);

     // Add bookmark with optional user ID parameter
    ApiResponse<BookmarkDTO> addBookmark(UUID causeId);

  // Remove bookmark with optional user ID parameter
    ApiResponse<Void> removeBookmark(UUID causeId);

   // Additional useful methods you might want to add
    // ApiResponse<Boolean> isBookmarked(UUID causeId, UUID userId);

     // ApiResponse<List<BookmarkDTO>> getBookmarksByCauseId(UUID causeId);

}
