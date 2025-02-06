import { useState } from "react";
import axios from "axios";
import config from "../../Config/config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useEditOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const editOrganization = async (organizationId, formData) => {
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      if (!formData.name || !organizationId || !formData.description) {
        throw new Error("Required fields are missing");
      }

      const organizationRequest = {
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || "",
        postalCode: formData.postalCode || "",
        registrationNumber: formData.registrationNumber || "",
        taxId: formData.taxId || "",
        // logoUrl: formData.logoUrl || "",
        country: formData.country?.name || "",
        state: formData.state?.name || "",
        city: formData.city?.name || "",
      };
      console.log("Organization request:", organizationRequest);

      // Add organization data as JSON
      formDataToSend.append(
        "organization",
        new Blob([JSON.stringify(organizationRequest)], {
          type: "application/json",
        })
      );

      // Log the FormData to inspect what is inside before sending
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Add logo if it is a file
      if (formData.logoUrl) {
        formDataToSend.append("logo", formData.logoUrl);
        // Log the logo file being appended
        console.log("Logo file appended:", formData.logoUrl);
      }

      // Send the request to the server
      const response = await axios.put(
        `${config.apiUrl}/api/v1/organization/${organizationId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Organization updated successfully");
      navigate(-1);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update organization";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating organization:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editOrganization, loading, error };
};

export default useEditOrganization;
