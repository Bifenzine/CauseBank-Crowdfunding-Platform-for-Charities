import React, { useState, useEffect } from "react";
import LocationSelector from "../../components/OrganizationComponents/CreateOrganizationModel/LocationSelector";
import ImagePicker from "../../components/ImagePicker/ImagePicker";
import { useAuthContext } from "../../Context/AuthContext";
import useEditOrganization from "../../Hooks/OrganizationHooks/useEditOrganization";
import {useNavigate, useParams} from "react-router-dom";
import { use } from "react";

const UpdateOrganization = () => {
  const { organizationId } = useParams();
  console.log("organizationId", organizationId);
  const { userOrganisation } = useAuthContext();
  console.log("userOrganisation", userOrganisation);
  const { editOrganization, loading } = useEditOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    userOrganisation;
  }, [organizationId]);

  // Consolidate all form data into one state
  const [formData, setFormData] = useState({
    name: userOrganisation?.name || "",
    description: userOrganisation?.description || "",
    websiteUrl: userOrganisation?.websiteUrl || "",
    addressLine1: userOrganisation?.addressLine1 || "",
    addressLine2: userOrganisation?.addressLine2 || "",
    postalCode: userOrganisation?.postalCode || "",
    registrationNumber: userOrganisation?.registrationNumber || "",
    taxId: userOrganisation?.taxId || "",
    logoUrl: userOrganisation?.logoUrl || "",
    country: userOrganisation?.country
      ? { name: userOrganisation.country }
      : "",
    state: userOrganisation?.state ? { name: userOrganisation.state } : "",
    city: userOrganisation?.city ? { name: userOrganisation.city } : "",
  });

  const [logoFile, setLogoFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoSelect = (file) => {
    setLogoFile(file);
    setFormData((prev) => ({
      ...prev,
      logoUrl: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.logoUrl
      //   !formData.state ||
      //   !formData.city
    ) {
      alert("Please fill in all required fields");
      return;
    }

    editOrganization(organizationId, formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 px-2 sm:px-2 lg:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-8 border-b pb-4">
            Update Organization Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo Section */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-full sm:w-1/3">
                <label className="text-lg font-semibold text-gray-700 mb-4 block">
                  Organization Logo
                </label>
                <div className="space-y-4">
                  {formData.logoUrl && !logoFile && (
                    <div className="relative group">
                      <img
                        src={formData.logoUrl}
                        alt="Current logo"
                        className="w-full aspect-square object-cover rounded-xl shadow-md transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm">Current Logo</span>
                      </div>
                    </div>
                  )}
                  <ImagePicker
                    onImageSelect={handleLogoSelect}
                    acceptedFileTypes="image/png,image/jpeg,image/gif,image/svg+xml"
                  />
                </div>
              </div>

              <div className="w-full sm:w-2/3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter organization name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      placeholder="Enter website URL"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    placeholder="Enter description"
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Location Selector */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Location Details</h3>
              <LocationSelector
                selectedCountry={formData?.country?.name}
                selectedState={formData?.state?.name}
                selectedCity={formData?.city?.name}
                onCountryChange={(value) =>
                  handleLocationChange("country", value)
                }
                onStateChange={(value) => handleLocationChange("state", value)}
                onCityChange={(value) => handleLocationChange("city", value)}
              />
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Enter Address Line 1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Enter Address Line 2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Enter Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="Enter Registration Number"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  placeholder="Enter Tax ID"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                {loading ? "Updating..." : "Update Organization"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrganization;
