import { createContext, useContext, useEffect, useState } from "react";
import { getOrganizationOfAuthenticatedUser } from "../DataFetching/DataFetching";

// should be fixed rapidly
// Create context for authentication
export const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Provider component to manage authentication state
// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  // // State to store the authentication token
  // const [token, setToken] = useState(() => {
  //   // Load token from localStorage, or return null if not available
  //   const storedToken = localStorage.getItem("causeBank-token");
  //   return storedToken || null;
  // });

  // State to store user role
  const [userRole, setUserRole] = useState(null);

  // Initialize userOrganisation with null
  const [userOrganisation, setUserOrganization] = useState(null);

  // State to store authenticated user data
  const [authUser, setAuthUser] = useState(() => {
    // Load user from localStorage, or return null if not available
    const storedUser = localStorage.getItem("causeBank-user");
    const storedTimestamp = localStorage.getItem("causebank-user-timestamp");

    const now = Date.now();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (
      storedUser &&
      storedTimestamp &&
      now - storedTimestamp < oneDayInMillis
    ) {
      const userData = JSON.parse(storedUser);
      // Set the initial user role when loading from storage
      setUserRole(userData.role);
      return userData;
    } else {
      // Clear localStorage if timestamp is older than 24 hours
      localStorage.removeItem("causeBank-user");
      localStorage.removeItem("causebank-user-timestamp");
      return null;
    }
  });

  // Effect to fetch user organization when token changes
  useEffect(() => {
    // if (token) {
    // Only fetch if user is authenticated
    getOrganizationOfAuthenticatedUser(authUser?.id)
      .then((response) => {
        setUserOrganization(response.data);
      })
      .catch((error) => {
        console.log(error, "userorganization isn't fetched");
      });
    // }
  }, [ authUser?.id]);

  // Function to update authUser and token with the latest user data
  const updateUserProfile = (userData) => {
    setAuthUser(userData);
    // setToken(userData?.token || null);
    setUserRole(userData?.role || null);
  };

  // Effect to update localStorage when authUser or token changes
  useEffect(() => {
    if (authUser) {
      // Store updated authUser and timestamp in localStorage
      // localStorage.setItem("causeBank-user", JSON.stringify(authUser));
      localStorage.setItem("causebank-user-timestamp", Date.now());
    }
    // if (token) {
    //   // Store the token in localStorage
    //   localStorage.setItem("causeBank-token", token);
    // }
  }, [authUser]);

  // Function to handle logout
  const logout = () => {
    setAuthUser(null);
    // setToken(null);
    setUserRole(null);
    setUserOrganization(null);
    localStorage.removeItem("causeBank-user");
    localStorage.removeItem("causeBank-token");
    localStorage.removeItem("causebank-user-timestamp");
  };

  // Provide context values to children components
  return (
    <AuthContext.Provider
      value={{
        authUser,
        // token,
        setAuthUser,
        // setToken,
        updateUserProfile,
        userOrganisation,
        userRole,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
