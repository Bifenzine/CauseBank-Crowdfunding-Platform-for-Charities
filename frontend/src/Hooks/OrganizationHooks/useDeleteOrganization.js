// src/hooks/useCreateCause.js
import { useState } from "react";
import ForumApi from "../../DataFetching/DataFetching";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";

const useDeleteOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authUser, token } = useAuthContext();
  // Remove token from context since ForumApi handles it automatically



  const deleteOrganization = async (organizationId) => {


    setLoading(true);
    setError(null);
    try {
      const response = await ForumApi.delete(
        `/api/v1/organization/${organizationId}`,
        // No need to specify headers or withCredentials as they're handled by ForumApi
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Organization deleted successfully");
      navigate("/");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete organization";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrganization, loading, error };
};

export default useDeleteOrganization;
