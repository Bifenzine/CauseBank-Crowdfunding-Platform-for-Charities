import { useState } from "react";
import axios from "axios";
import config from "../../../Config/config";

// Custom hook for creating organization stripe account
export const useCreateOrganizationStripeAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAccount = async (organizationId, data) => {
    setIsLoading(true);
    setError(null);

    // Format the data to match backend expectations
    const formattedData = {
      email: data.email,
      country: data.country?.iso2 || "", // Send just the country code as string like for turkey TR
      businessType: data.businessType,
      businessProfile: {
        name: data.businessProfile.name,
        url: data.businessProfile.url,
        // mcc: data.businessProfile.mcc,
      },
    };
    try {
      const response = await axios.post(
        `${config?.apiUrl}/api/v1/organization/${organizationId}/connect/account`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createAccount, isLoading, error };
};
