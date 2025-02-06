import { useState } from "react";
import axios from "axios";
import config from "../../Config/config";
import {useAuthContext} from "../../Context/AuthContext.jsx";
import formatDateToZonedDateTime from "../../Utils/FormatDateToZonedDateTime.js";

const useCreateCause = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  const createCause = async (formData) => {
    setLoading(true);
    setError(null);

    console.log("Initial form data:", formData);

    try {
      const formDataToSend = new FormData();

      if (!formData.title || !formData.organizationId || !formData.categoryId) {
        throw new Error("Required fields are missing");
      }

      const causeRequest = {
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        goalAmount: parseFloat(formData.goalAmount),
        startDate: formatDateToZonedDateTime(formData.startDate),
        endDate: formatDateToZonedDateTime(formData.endDate),
        organizationId: formData.organizationId,
        categoryId: formData.categoryId,
        country: formData.country,
        isFeatured: formData.isFeatured || false,
        userId: formData.userId,
        status : formData.status
      };

      console.log("Formatted cause request:", causeRequest);

      formDataToSend.append(
        "cause",
        new Blob([JSON.stringify(causeRequest)], { type: "application/json" })
      );

      if (formData.featuredImage?.file) {
        console.log("Featured image details:", {
          name: formData.featuredImage.file,
          // size: formData.featuredImage.size,
          // type: formData.featuredImage.type,
        });
        formDataToSend.append("featuredImage", formData?.featuredImage?.file);
      }

      if (formData.additionalImages?.length > 0) {
        console.log(
          "Additional images count:",
          formData.additionalImages.length
        );
        formData.additionalImages.forEach((image, index) => {
          if (image.file) {
            console.log(`Additional image ${index + 1} details:`, {
              name: image.file.name,
              size: image.file.size,
              type: image.file.type,
            });
            formDataToSend.append("media", image.file);
          }
        });
      }

      console.log("Request URL:", `${config.apiUrl}/api/v1/causes`);

      const response = await axios.post(
        `${config.apiUrl}/api/v1/causes`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Server response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create cause");
      }

      return response.data;
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create cause";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createCause, loading, error };
};

export default useCreateCause;
