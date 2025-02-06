import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../../Context/AuthContext";
import CountrySelector from "../../../components/CausesComponents/CreateCause/CountrySelector";
import ImagePicker from "./ImagePicker";
import useCategrories from "../../../Hooks/CatgoriesHooks/useCategories";
import { useNavigate, useParams } from "react-router-dom"; // Add navigation
import useCreateCause from "../../../Hooks/CauseHooks/useCreateCause";
import {getAllStatus} from "../../../DataFetching/DataFetching.js";
import StatusSelector from "../../../components/CausesComponents/StatusSelector/StatusSelector.jsx";

const CreateCausePage = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { authUser, userOrganisation } = useAuthContext();
  const { createCause, loading: createLoading } = useCreateCause();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { categories, loading: categoriesLoading } = useCategrories();
  const [causeStatus, setCausesStatus] = useState(null);
  console.log("organizationIs", organizationId);

  const [formData, setFormData] = useState({
    organizationId: organizationId,
    categoryId: "",
    title: "",
    description: "",
    summary: "",
    featuredImage: null,
    additionalImages: [],
    goalAmount: 0,
    endDate: "",
    startDate: "",
    isFeatured: true,
    country: "",
    userId: authUser?.id,
    status: "DRAFT"
  });

  useEffect(() => {
    getAllStatus().then((response) => {
      setCausesStatus(response?.data);
      console.log("status", response?.data);
    }).catch(
        console.log("error")
    )
  }, []);

  const handleStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
    console.log(status);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      country: country.name,
    }));
  };

  const handleImagesSelect = (images) => {
    setFormData((prev) => ({
      ...prev,
      images: images,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if at least one image is selected
    if (!formData.featuredImage?.length && !formData.additionalImages?.length) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      const result = await createCause(formData);
      toast.success("Cause created successfully!");
      navigate(`/organization/${organizationId}`); // Navigate to the new cause
    } catch (error) {
      toast.error(error.message || "Failed to create cause");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Adjust header text sizes for smaller screens */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Create New Cause
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Fill in the details below to create your fundraising cause
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Adjust form header padding */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Basic Information
              </h2>
            </div>

            {/* Adjust form content padding */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Title Section */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cause Title
              </label>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* ... Title input remains the same ... */}
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 outline-none rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  required
                  minLength={2}
                  maxLength={255}
                  placeholder="Enter a compelling title"
                />
              </div>

              {/* Summary & Description */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Adjust textarea heights for mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base outline-none rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Brief overview of your cause"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base outline-none rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Provide detailed information about your cause"
                  />
                </div>
              </div>

              {/* Image & Goal Amount */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="w-full">
                  <ImagePicker
                    onImagesSelect={(image) =>
                      setFormData((prev) => ({
                        ...prev,
                        featuredImage: image,
                      }))
                    }
                    selectedImages={formData.featuredImage}
                    isFeatured={true}
                    maxFiles={1}
                    label="Featured Image (Required)"
                  />
                </div>

                <div className="w-full">
                  <ImagePicker
                    onImagesSelect={(images) =>
                      setFormData((prev) => ({
                        ...prev,
                        additionalImages: images,
                      }))
                    }
                    selectedImages={formData.additionalImages}
                    maxFiles={6}
                    label="Additional Images"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Amount ($)
                  </label>
                  <input
                    type="number"
                    name="goalAmount"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base outline-none rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter target amount"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Date inputs with adjusted sizing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base outline-none rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base outline-none rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Country Selector */}
              <div className="grid grid-cols-2 gap-3">
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountryChange={handleCountryChange}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="mt-1 block w-full py-2 rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {categoriesLoading ? "loading ..." : category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <StatusSelector
                    selectedStatus={formData.status}
                    onStatusChange={handleStatusChange}
                    statusOptions={causeStatus}
                />
              </div>

              {/* Visibility Toggle with adjusted padding */}
              <div className="flex items-center space-x-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition duration-200"
                />
                <label className="text-xs sm:text-sm text-gray-700">
                  Make this cause public and visible to all users
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button with adjusted sizing */}
          <div className="flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={createLoading}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:-translate-y-1">
              {createLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                </span>
              ) : (
                "Create Cause"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCausePage;
