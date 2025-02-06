// src/hooks/useCreateOrganization.js
import { useState } from "react";
import axios from "axios";
import config from "../../Config/config";

const useCreateOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const createOrganization = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Create organization request object
      const organizationRequest = {
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || "",
        country: formData.country?.name || "",
        state: formData.state?.name || "",
        city: formData.city?.name || "",
      };

      // Add organization data as JSON
      formDataToSend.append(
        "organization",
        new Blob([JSON.stringify(organizationRequest)], {
          type: "application/json",
        })
      );

      // Add logo if exists
      if (formData.logoUrl) {
        formDataToSend.append("logo", formData.logoUrl);
      }

      const response = await axios.post(
        `${config.apiUrl}/api/v1/organization/create`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create organization";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createOrganization, loading, error };
};

export default useCreateOrganization;
