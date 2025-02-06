import React, { createContext, useContext, useEffect, useState } from "react";
import { getBookmarkedCauses } from "../DataFetching/DataFetching";
import { useAuthContext } from "./AuthContext";

// Create context for authentication
export const BookmarkContext = createContext();

// Custom hook to use authentication context
export const useBookmarkContext = () => {
  return useContext(BookmarkContext);
};

// Provider component to manage authentication state
export const BookmarkContextProvider = ({ children }) => {
  // State to store the authentication token
  const { authUser } = useAuthContext();
  const [bookmarkedCauses, setBookmarkedCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedCauses = async () => {
    try {
      setLoading(true);
      const causes = await getBookmarkedCauses(authUser?.id);
      setBookmarkedCauses(causes.data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedCauses();
  }, [authUser?.id]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedCauses,
        loading,
        error,
        fetchBookmarkedCauses,
      }}>
      {children}
    </BookmarkContext.Provider>
  );
};
