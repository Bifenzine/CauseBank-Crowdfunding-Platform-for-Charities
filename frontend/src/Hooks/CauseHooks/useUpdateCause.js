import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import config from "../../Config/config";
import { useNavigate } from "react-router-dom";
import {useAuthContext} from "../../Context/AuthContext.jsx";
import formatDateToZonedDateTime from "../../Utils/FormatDateToZonedDateTime.js";

const useUpdateCause = () => {
  const {authUser ,token} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  const updateCause = async (causeId, formData) => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      const causeRequest = {
        title: formData?.title,
        summary: formData?.summary,
        description: formData?.description,
        goalAmount: formData?.goalAmount,
        startDate: formData?.startDate,
        endDate: formatDateToZonedDateTime(formData?.endDate),
        organizationId: formData?.organizationId,
        categoryId: formData?.categoryId,
        country: formData?.country,
        isFeatured: formData?.isFeatured || false,
        userId: formData?.userId,
        status: formData?.status,
      };

      console.log("format cause request", causeRequest);

      formDataToSend.append(
        "updatedCauseDetails",
        new Blob([JSON.stringify(causeRequest)], { type: "application/json" })
      );

      if (formData.featuredImage?.file) {
        formDataToSend.append("featuredImage", formData.featuredImage.file);
      }

      if (formData.additionalImages?.length > 0) {
        formData.additionalImages.forEach((image) => {
          if (image.file) {
            formDataToSend.append("media", image.file);
          }
        });
      }

      // Handle deletedMediaIds as a JSON string
      if (formData.deleteMediaIds?.length > 0) {
        formDataToSend.append(
          "deletedMediaIds",
          JSON.stringify(formData.deleteMediaIds)
        );
      }

      const response = await axios.put(
        `${config.apiUrl}/api/v1/causes/${causeId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Cause updated successfully");
      navigate(-1);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update cause";
      toast.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateCause, loading, error };
};

export default useUpdateCause;
