import React, { useState } from "react";
import { useCreateOrganizationStripeAccount } from "../../../Hooks/OrganizationHooks/StripeAccount/useCreateOrganizationStripeAccount";
import CountrySelector from "../../CausesComponents/CreateCause/CountrySelector";

// MCC codes for the select option
const MCC_CODES = [
  { value: "5734", label: "Computer Software Stores" },
  { value: "5735", label: "Record & Music Stores" },
  { value: "5815", label: "Digital Goods" },
  // Add more MCC codes as needed
];

const StripeConnectModel = ({ onClose, userOrganization }) => {
  console.log("userorg", userOrganization);

  const [formData, setFormData] = useState({
    email: "",
    country: userOrganization?.country,
    businessType: "company",
    businessProfile: {
      name: userOrganization?.name,
      url: userOrganization?.websiteUrl,
    },
  });

  const { createAccount, isLoading, error } =
    useCreateOrganizationStripeAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccount(userOrganization?.id, {
        ...formData,
        country: formData.country,
      });
      onClose();
    } catch (err) {
      console.error("Failed to create account:", err);
    }
  };

  const handleCountryChange = (country) => {
    setFormData((prev) => ({
      ...prev,
      country,
    }));
    console.log(country);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto "
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-left sm:mt-0">
              <h3
                className="text-lg font-medium leading-6 text-gray-900"
                id="modal-title">
                {`Create for ${userOrganization?.name} a connect Account`}
              </h3>

              <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block p-2 border outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <CountrySelector
                  selectedCountry={formData.country}
                  onCountryChange={handleCountryChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({ ...formData, businessType: e.target.value })
                    }
                    className="mt-1 block p-2 border outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="company">Company</option>

                    <option value="individual">Individual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessProfile.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessProfile: {
                          ...formData.businessProfile,
                          name: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block p-2 border outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business URL
                  </label>
                  <input
                    type="url"
                    value={formData.businessProfile.url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessProfile: {
                          ...formData.businessProfile,
                          url: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block p-2 border outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Merchant Category Code (MCC)
                  </label>
                  <select
                    value={formData.businessProfile.mcc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessProfile: {
                          ...formData.businessProfile,
                          mcc: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block p-2 border outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    {MCC_CODES.map((code) => (
                      <option key={code.value} value={code.value}>
                        {code.label}
                      </option>
                    ))}
                  </select>
                </div> */}

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-start-2 sm:text-sm">
                    {isLoading ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StripeConnectModel;
