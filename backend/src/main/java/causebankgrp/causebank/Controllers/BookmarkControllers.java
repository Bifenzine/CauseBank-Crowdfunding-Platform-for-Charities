package causebankgrp.causebank.Controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import causebankgrp.causebank.Dto.BookmarkDTO.BookmarkDTO;
import causebankgrp.causebank.Dto.OrganizationDTO.Response.ApiResponse;
import causebankgrp.causebank.Services.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkControllers {

     private final BookmarkService bookmarkService;

     @Operation(summary = "Get bookmarks by user ID", description = "Retrieves all bookmarks for a specific user")
    // tested with postman : working
     @GetMapping("/user/{userId}")
     public ResponseEntity<ApiResponse<List<BookmarkDTO>>> getBookmarksByUserId(
     @PathVariable @Parameter(description = "User ID", required = true) UUID
     userId,
     @RequestParam(defaultValue = "0") int page,
     @RequestParam(defaultValue = "10") int size) {
     ApiResponse<List<BookmarkDTO>> response =
     bookmarkService.getBookmarksByUserId(userId, page, size);
     return ResponseEntity.ok().body(response);
     }

     @Operation(summary = "Add a bookmark", description = "Adds a new bookmark for the authenticated user")
     // tested with postman : working
     @PostMapping("/{causeId}")
     public ResponseEntity<ApiResponse<BookmarkDTO>> addBookmark(
     @PathVariable @Parameter(description = "Cause ID", required = true) UUID
     causeId) {
     ApiResponse<BookmarkDTO> response = bookmarkService.addBookmark(causeId);
     return ResponseEntity.ok().body(response);
     }

     @Operation(summary = "Remove a bookmark", description = "Removes a bookmark for the authenticated user")
     // tested with postman : working
     @DeleteMapping("/{causeId}")
     public ResponseEntity<ApiResponse<Void>> removeBookmark(
     @PathVariable @Parameter(description = "cause ID", required = true) UUID
     causeId) {
     ApiResponse<Void> response = bookmarkService.removeBookmark(causeId);
     return ResponseEntity.ok().body(response);
     }
}
