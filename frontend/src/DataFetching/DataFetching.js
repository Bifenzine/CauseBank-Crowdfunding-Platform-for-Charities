import axios from "axios";
import config from "../Config/config.js";

const ForumApi = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

// Set default headers
ForumApi.defaults.headers.common["x-client-type"] = "web"; // or 'mobile', depending on the context
// send athorization header
// ForumApi.defaults.headers.common[
//   "Authorization"
// ] = `Bearer ${localStorage.getItem("causeBank-token")}`;

// get all users
export const getAllUsers = () => ForumApi.get("/users");

// Get all organizations
export const getAllOrganizations = () =>
  ForumApi.get("/api/v1/organization/allOrganizations");

// Get organization by ID
export const getOrganizationById = (organizationId) =>
  ForumApi.get(`/api/v1/organization/${organizationId}`);

export const getOrganizationCauses = (organizationId) =>
  ForumApi.get(`/api/v1/causes/organization/${organizationId}`);

export const getOrganizationActiveAndCompletedCauses = (organizationId) =>
    ForumApi.get(`/api/v1/causes/organization/${organizationId}/Active-Completed-featured`);

export const getOrganizationOfAuthenticatedUser = async (userId) => {
  try {
    const response = await ForumApi.get(
      `/api/v1/organization/userOrganizations/${userId}`,
      {
        withCredentials: true,
      }
    );
    // console.log("User's organization data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching organization data:", error);
    throw error;
  }
};

//  get organization onboarding link
export const getOrganizationOnboardingLink = async (organizationId) => {
  try {
    const response = await ForumApi.get(
      `/api/v1/organization/${organizationId}/connect/account-link`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching organization data:", error);
    throw error;
  }
};

// get organization stripe account status
export const getOrganizationStripeAccountStatus = async (organizationId) => {
  try {
    const response = await ForumApi.get(
      `/api/v1/organization/${organizationId}/connect/account-status`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching organization data:", error);
    throw error;
  }
};

// get user info
export const getUserInfo = (userId) => ForumApi.get(`/api/v1/users/${userId}`);

// get user info for user profile page
export const getUserProfileAndPosts = (userId) =>
  ForumApi.get(`/api/user/posts/${userId}`);

// get post detail
export const getCauseDetail = (causeId) =>
  ForumApi.get(`/api/v1/causes/causeId/${causeId}`);

// getCauseMedia
export const getCauseMedia = (causeId) =>
  ForumApi.get(`/api/v1/causes/media/${causeId}`);

export const getAllStatus = () => ForumApi.get("/api/v1/causes/status");

export const getActiveAndFeaturedCauses = () =>
  ForumApi.get("/api/v1/causes/featured");

export const getAllCountries = () => ForumApi.get("/api/v1/causes/countries");

// get all donations
export const getAllDonations = () => ForumApi.get("/api/v1/donations");
// get all categories
export const getAllCategories = () => ForumApi.get("/api/v1/categories/active");

// get causes by category
export const getCausesByCategory = (categoryId) =>
  ForumApi.get(`/api/v1/causes/category/${categoryId}`);

// get posts by categories
export const getCausesByCountry = (country, page = 0, size = 10) =>
  ForumApi.get(`/api/v1/causes/country/${country}`, {
    params: { page, size },
  });

// get Organization Dashboard
export const getOrganizationDashboard = (stripeAccountId) =>
  ForumApi.get(`api/v1/stripe/account/${stripeAccountId}`);

// get comments for post
export const getCommentsForPost = (postId) =>
  ForumApi.get(`/comments/CommentsPost/${postId}`);

// get bookmarked Post for the authenticated user
export const getBookmarkedCauses = async (userId) => {
  try {
    // Fetch the bookmarked posts for the authenticated user
    const response = await ForumApi.get(`/api/v1/bookmarks/user/${userId}`, {
      withCredentials: true,
    });


    return response.data; // Return the bookmarked posts data
  } catch (error) {
    console.error("Error fetching bookmarked causes:", error);
    throw error; // Throw the error to handle it in the component
  }
};

// get clans
export const getClans = async () => ForumApi.get("/clans/All");

// get clan by id
export const getClan = async (ClanId) => ForumApi.get(`/clans/info/${ClanId}`);

// get clans by category
export const getClansByCategory = async (categoryId) =>
  ForumApi.get(`/clans/category/${categoryId}`);

// search posts
export const searchPosts = (query) =>
  ForumApi.get(`/search/posts?query=${query}`);

// search clans
export const searchClans = (query) =>
  ForumApi.get(`/search/clans?query=${query}`);

// search users
export const searchUsers = (query) =>
  ForumApi.get(`/search/users?query=${query}`);

export const getTrendingPostsInClan = (clanId) =>
  ForumApi.get(`/clans/posts/trending/${clanId}`);

export const getPopularPostsInClan = (clanId) =>
  ForumApi.get(`/clans/posts/popular/${clanId}`);

export const getNewestPostsInClan = (clanId) =>
  ForumApi.get(`/clans/posts/newest/${clanId}`);

export const getAllTimeRanking = () => ForumApi.get("/clans/ranking/allTime");

export const getMonthlyRanking = () => ForumApi.get("/clans/ranking/monthly");

export const getWeeklyRanking = () => ForumApi.get("/clans/ranking/weekly");

export const getConversations = async () => {
  try {
    // Fetch conversations for the authenticated user
    const response = await ForumApi.get("/conversations", {
      withCredentials: true,
    });

    return response.data; // Return the conversations data
  } catch (error) {
    console.error("Error fetching conversations data:", error);
    throw error; // Throw the error to handle it in the component
  }
};

export const getMessages = async (conversationId, page = 1, limit = 10) => {
  try {
    const response = await ForumApi.get(
      `/messages/conversation/${conversationId}`,
      {
        params: { page, limit },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages data:", error);
    throw error;
  }
};

export const getClanMessages = async (clanId, page = 1, limit = 10) => {
  try {
    const response = await ForumApi.get(`/messages/Clans/${clanId}/messages`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages data:", error);
    throw error;
  }
};

export const getUserClanChats = async () => {
  try {
    // Fetch conversations for the authenticated user
    const response = await ForumApi.get("/messages/Clans", {
      withCredentials: true,
    });

    return response.data; // Return the conversations data
  } catch (error) {
    console.error("Error fetching conversations data:", error);
    throw error; // Throw the error to handle it in the component
  }
};

export const getClansthatTheUserBelongsTo = async (userID) =>
  ForumApi.get(`/clans/user/${userID}`);

export const getNotifications = async () => {
  try {
    const response = await ForumApi.get("/notifications", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

export const getSuggestedUserstoFollow = async () => {
  try {
    const response = await ForumApi.get("/users/suggestedUsersToFollow", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested users to follow:", error);
  }
};

export const getUserFeedPosts = async (page = 1, limit = 5) => {
  try {
    const response = await ForumApi.get("/users/userFeedPosts", {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user feed posts:", error);
    throw error;
  }
};

export const getSuggestedPosts = async (PostID) => {
  try {
    const response = await ForumApi.get(`/api/suggestedPosts/${PostID}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested posts:", error);
    throw error;
  }
};

export const getUnreadConversationsCount = async () => {
  try {
    const response = await ForumApi.get("/conversations/unread", {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching unread conversations count:", error);
    throw error;
  }
};

export const getQuickUnreadCount = async () => {
  try {
    const response = await ForumApi.get("/conversations/unread/count", {
      withCredentials: true,
    });
    console.log("quick unread conversations count :", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread conversations count:", error);
    throw error;
  }
};

export default ForumApi;
