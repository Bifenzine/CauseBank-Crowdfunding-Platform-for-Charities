import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCauseDetail,
  getCauseMedia,
  getAllCategories, getAllStatus,
} from "../../../DataFetching/DataFetching";
import { Loader2 } from "lucide-react";
import ImagePicker from "../../../Pages/CausePage/Create/ImagePicker";
import useUpdateCause from "../../../Hooks/CauseHooks/useUpdateCause";
import StatusSelector from "../../../components/CausesComponents/StatusSelector/StatusSelector.jsx";

const UpdateCausePage = () => {
  const { causeId } = useParams();
  const [categories, setCategories] = useState([]);
  const [causeData, setCauseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [causeMedia, setCauseMedia] = useState([]);
  const [causeStatus, setCausesStatus] = useState(null);
  const [deleteMediaIds, setDeleteMediaIds] = useState([]);
  const { updateCause, loading: updateCauseLoading } = useUpdateCause();
  const [formData, setFormData] = useState({
    title: "",
    organizationId: "",
    userId: "",
    description: "",
    summary: "",
    category: "",
    featuredImage: [],
    additionalImages: [],
    isFeatured: true,
    status: "",
    endDate: null,
    goalAmount: 0,
    startDate: null,
  });

  useEffect(() => {
    getAllStatus().then((response) => {
      setCausesStatus(response?.data);
      console.log("status", response?.data);
    }).catch(
        console.log("error")
    )
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [causeResponse, categoriesResponse, causeMediaResponse] =
          await Promise.all([
            getCauseDetail(causeId),
            getAllCategories(),
            getCauseMedia(causeId),
          ]);

        setCauseData(causeResponse.data.data);
        setCategories(categoriesResponse.data);
        setCauseMedia(causeMediaResponse.data.data);

        // Set the featured image from causeData
        console.log("Cause Response Data:", causeResponse.data.data);
        const formattedFeaturedImage = causeResponse.data.data
          ? {
              url: causeResponse.data.data.featuredImageUrl,
              id: causeResponse.data.data.id,
            }
          : null;
        console.log("Formatted Featured Image:", formattedFeaturedImage);

        // Set additional images from causeMedia
        const additionalImages = causeMediaResponse.data.data.map((item) => ({
          url: item.mediaUrl,
          id: item.id,
        }));

        setFormData({
          title: causeResponse.data.data.title || "",
          userId: causeResponse.data.data.organization?.userId || "",
          organizationId: causeResponse.data.data.organization?.id || "",
          description: causeResponse.data.data.description || "",
          summary: causeResponse.data.data.summary || "",
          categoryId: causeResponse.data.data.category?.id || "",
          featuredImage: formattedFeaturedImage,
          additionalImages: additionalImages || [],
          isFeatured: causeResponse.data.data.isFeatured || true,
          status: causeResponse?.data?.data?.status || "",
          endDate: causeResponse.data.data.endDate || null,
          country: causeResponse.data.data.country || "",
          goalAmount: causeResponse.data.data.goalAmount || 0,
          startDate: causeResponse.data.data.startDate || null,
        });
      } catch (err) {
        setError("Error loading data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [causeId]);

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

  const handleFeaturedImageChange = (image) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: image, // Take first image since it's single image
    }));
  };

  const handleAdditionalImagesChange = (images) => {
    const deletedImages = formData.additionalImages.filter(
      (img) => !images.some((newImg) => newImg.id === img.id)
    );

    // Add deleted image IDs to deleteMediaIds state
    setDeleteMediaIds((prev) => [
      ...prev,
      ...deletedImages.map((img) => img.id),
    ]);
    setFormData((prev) => ({
      ...prev,
      additionalImages: images,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      deleteMediaIds, // Include deleted media IDs in the form data
    };

    await updateCause(causeId, updatedFormData);
    // console.log("Submitting form data:", formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Update Cause
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Update your fundraising cause details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Cause Information
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Information Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Image Pickers */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <ImagePicker
                  onImagesSelect={handleFeaturedImageChange}
                  selectedImages={formData.featuredImage}
                  maxFiles={1}
                  label="Featured Image"
                  isFeatured={true}
                  initialImage={formData.featuredImage}
                />

                <ImagePicker
                  onImagesSelect={handleAdditionalImagesChange}
                  selectedImages={formData.additionalImages}
                  maxFiles={6}
                  label="Additional Images"
                />
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>

              {/* Date and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <StatusSelector
                      selectedStatus={formData.status}
                      onStatusChange={handleStatusChange}
                      statusOptions={causeStatus}
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  Feature this cause (will be displayed prominently)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              disabled={updateCauseLoading}
              type="submit"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
              {updateCauseLoading ? "Updating..." : "Update Cause"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCausePage;