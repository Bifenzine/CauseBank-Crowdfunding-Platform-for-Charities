import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaSpinner } from "react-icons/fa";
import useAddCauseToBookmark from "../../Hooks/BookmarkHooks/useAddCauseToBookmark";
import useDeleteCauseFromBookmark from "../../Hooks/BookmarkHooks/useDeleteCauseFromBookmark";
import { useBookmarkContext } from "../../Context/BookmarkContext";
import {useAuthContext} from "../../Context/AuthContext.jsx";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const Bookmark = ({ causeId }) => {
  const {authUser} = useAuthContext();
  const { bookmarkLoading, bookmarkedCauses , fetchBookmarkedCauses } = useBookmarkContext();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { addCauseToBookmark, loading: addLoading } = useAddCauseToBookmark();
  const { deleteCauseFromBookmark, loading: deleteLoading } =
    useDeleteCauseFromBookmark();


  // Check if the cause is bookmarked
  useEffect(() => {
    let isMounted = true;

    const isCurrentCauseBookmarked = bookmarkedCauses?.some(
        (bookmark) => bookmark.causeId === causeId
    );
    if (isMounted) {
      setIsBookmarked(isCurrentCauseBookmarked);
    }

    return () => {
      isMounted = false;
    };
  }, [bookmarkedCauses, causeId]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked && authUser) {
        await deleteCauseFromBookmark(causeId);
        setIsBookmarked(false);
        await fetchBookmarkedCauses(); // Add this
      } else if (!isBookmarked && authUser) {
        await addCauseToBookmark(causeId);
        setIsBookmarked(true);
        await fetchBookmarkedCauses(); // Add this
      } else {
        toast.error("You need to be logged in to bookmark a post");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setIsBookmarked(!isBookmarked);
    }
  };

  // Disable button during loading states
  const isLoading = addLoading || deleteLoading;

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      className={`relative transition-transform duration-200 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
      }`}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
      {bookmarkLoading ? (
        <FaSpinner className="w-5 h-5 text-gray-600 animate-spin" />
      ) : isBookmarked ? (
        <FaHeart className="w-5 h-5 text-red-500" />
      ) : (
        <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
      )}
    </button>
  );
};

export default Bookmark;
