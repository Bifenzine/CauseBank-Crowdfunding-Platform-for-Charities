import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../../Context/AuthContext";
import config from "../../Config/config";

const useDeleteCauseFromBookmark = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authUser, token } = useAuthContext();
  const deleteCauseFromBookmark = async (causeId) => {
    console.log("causeId", causeId);
    console.log("token", token);

    if (!authUser) {
      toast.error("You need to be logged in to bookmark a cause");
      return;
    }

    setLoading(true);
    try {
      //    Make a request to delete the post from the bookmark
      await axios.delete(
        `${config.apiUrl}/api/v1/bookmarks/${causeId}`,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Cause removed from bookmark successfuly");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      toast.error("an error has occured when removing the cause from bookmark");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteCauseFromBookmark };
};

export default useDeleteCauseFromBookmark;
