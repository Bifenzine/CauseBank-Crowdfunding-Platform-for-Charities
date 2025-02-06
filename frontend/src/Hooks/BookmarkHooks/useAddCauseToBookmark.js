import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../Context/AuthContext";
import config from "../../Config/config";

const useAddCauseToBookmark = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authUser, token } = useAuthContext();



  const addCauseToBookmark = async (causeId) => {
    console.log("causeId", causeId);
    console.log("Authorization header:", `Bearer ${token}`); // Debug log
    console.log("token", token);

    if (!authUser) {
      toast.error("You need to be logged in to bookmark a cause");
      return;
    }

    setLoading(true);
    try {
      // The configuration object should be the third parameter, not the second
      await axios.post(
        `${config.apiUrl}/api/v1/bookmarks/${causeId}`,
        {}, // empty request body as second parameter
        {
          // Config object as third parameter
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Cause Bookmarked successfully");
    } catch (error) {
      console.error("Error details:", error.response); // Debug log
      setError(error.response?.data?.message || "An error occurred");
      toast.error("An error occurred when bookmarking the cause");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addCauseToBookmark };
};

export default useAddCauseToBookmark;
