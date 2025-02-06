import React, { useState } from "react";
import LocationSelector from "./LocationSelector";
import { FaTimes } from "react-icons/fa";
import useCreateOrganization from "../../../Hooks/OrganizationHooks/useCreateOrganization";
import ImagePicker from "../../ImagePicker/ImagePicker";
import axios from "axios";

const CreateOrganizationModal = ({ handleModalStat, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: null,
    description: "",
    websiteUrl: "",
    addressLine1: "",
    addressLine2: "",
    country: null,
    state: null,
    city: null,
  });

  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleCountryChange = (country) => {
    setFormData((prev) => ({
      ...prev,
      country,
      state: null,
      city: null,
    }));
  };

  const handleStateChange = (state) => {
    setFormData((prev) => ({
      ...prev,
      state,
      city: null,
    }));
  };
  const handleImageSelect = (file) => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: file,
    }));
  };

  const handleCityChange = (city) => {
    setFormData((prev) => ({
      ...prev,
      city,
    }));
  };

  const { createOrganization, loading } = useCreateOrganization();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createOrganization(formData);
      // Handle success (e.g., show success message, redirect)
      console.log("Organization created:", result);
      onSuccess();
      handleModalStat();
    } catch (err) {
      // Error is already handled in the hook
      console.error("Failed to create organization:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl font-semibold text-gray-900">
                Create Organization
              </h3>
              <button
                onClick={handleModalStat}
                className="text-gray-400 hover:text-gray-500 transition-colors">
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 outline-none rounded-md border border-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    placeholder="Enter organization name"
                  />
                </div>
                {/* imagepicker */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Organization logo
                  </label>
                  <ImagePicker
                    onImageSelect={handleImageSelect}
                    acceptedFileTypes="image/*,.gif"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={2}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block p-2 outline-none w-full rounded-md border border-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  placeholder="Describe your organization"
                />
              </div>

              <div>
                <label
                  htmlFor="websiteUrl"
                  className="block text-sm font-medium text-gray-700">
                  websiteUrl
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 outline-none rounded-md border border-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <LocationSelector
                  selectedCountry={formData.country}
                  selectedState={formData.state}
                  selectedCity={formData.city}
                  onCountryChange={handleCountryChange}
                  onStateChange={handleStateChange}
                  onCityChange={handleCityChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 outline-none rounded-md border border-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    placeholder="Enter address line 1 required"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 outline-none rounded-md border border-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    placeholder="Enter address line 2 optional"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleModalStat}
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Organization"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
