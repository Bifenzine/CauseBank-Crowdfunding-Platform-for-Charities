import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import config from "../../Config/config";
import {useAuthContext} from "../../Context/AuthContext.jsx";

// tested : working
const useDeleteCause = () => {
  const {token} = useAuthContext();
  const [error, setError] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate(); // Access the navigate function for navigation



  const deleteCause = async (causeId) => {


    try {
      setLoadingDelete(true);
      const response = await axios.delete(
        `${config.apiUrl}/api/v1/causes/${causeId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}` // Move this here
          },
        }
      );
      setLoadingDelete(false);
      toast.success("Cause deleted successfully!");
      // navigate(-1);

      return response.data;
    } catch (error) {
      setLoadingDelete(false);
      setError(error.response.data.error);
      toast.error("Failed to delete cause");
      throw new Error(error.response.data.error); // Throw error to handle it in the component
    }
  };

  return { deleteCause, error, loadingDelete };
};

export default useDeleteCause;
