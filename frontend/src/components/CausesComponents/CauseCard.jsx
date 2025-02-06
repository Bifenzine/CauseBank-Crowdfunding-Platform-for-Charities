import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Bookmark from "../Bookmark/Bookmark";
import StatusBadge from "../../Utils/StatusBadge";
import { Calendar, Users, Eye, ChevronRight } from 'lucide-react';
import DropdownMenu from './DropdownMenu/DropdownMenu.jsx';
import useDeleteCause from "../../Hooks/CauseHooks/useDeleteCause.js";
import CustomAlert from "../AlertComponent/CustomAlert.jsx";
import {useAuthContext} from "../../Context/AuthContext.jsx"; // Import the DropdownMenu component

const CauseCard = ({
                     causeId,
                     causeFeaturedImageUrl,
                     causeTitle,
                     causeDescription,
                     causeCategory,
                     causeCountry,
                     causeGoalAmount,
                     causeCurrentAmount,
                     causeOrganization,
                     causeDonorCount,
                     causeViewCount,
                     causeEndDate,
                     causeStatus
                   }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const {authUser} = useAuthContext();
  const { deleteCause ,loadingDelete } = useDeleteCause();
  const navigate = useNavigate();

  const calculateProgress = () => {
    if (!causeGoalAmount) return 0;
    const progress = (causeCurrentAmount / causeGoalAmount) * 100;
    return Math.min(progress, 100);
  };

  const isCompleted = causeStatus === 'COMPLETED' || causeCurrentAmount >= causeGoalAmount;
  const progressPercentage = calculateProgress();

  const handleDonateClick = async () => {
    if (isCompleted) return;
    window.location.href = `/donate/${causeId}`;
  };

  // Handle Delete Action
  const handleDelete = () => {
    setShowAlert(true);
  };
  const confirmDelete = async () => {
    try {
      await deleteCause(causeId); // Use the delete hook
      setShowAlert(false);
      // window.location.href = `/`; // Redirect after deletion
    } catch (error) {
      console.error("Error deleting cause:", error);
    }
  };

  // Handle Update Action
  const handleUpdate = () => {
    // Navigate to the update page
    navigate(`/updatecause/${causeId}`);
  };

  return (
      <>
      <div
          className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative w-full h-52 sm:h-56 overflow-hidden">
          <img
              src={causeFeaturedImageUrl || "/api/placeholder/400/320"}
              alt={causeTitle}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Bookmark */}
          <div className="absolute -bottom-1 right-0 bg-white backdrop-blur-sm p-2 rounded-l-lg transform transition-transform duration-300 border-l-4 border-red-300">
            <Bookmark causeId={causeId} />
          </div>

          {/* Category & Country Badge */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {causeCategory?.name && (
                <Link
                    to={`/categories/${causeCategory?.id}/causes`}
                    className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {causeCategory?.name}
                </Link>
            )}
            {causeCountry && (
                <Link
                    to={`/country/${causeCountry}/causes`}
                    className="bg-white/90 backdrop-blur-sm text-emerald-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  {causeCountry}
                </Link>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-4 left-4">
            <StatusBadge status={causeStatus} />
          </div>

          {/* Dropdown Menu */}
            {authUser?.id === causeOrganization?.userId && (
          <div className="absolute top-4 right-4">
            <DropdownMenu onDelete={handleDelete} onUpdate={handleUpdate} />
          </div>
            )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Organization */}
          <Link
              to={`/organization/${causeOrganization?.id}`}
              className="inline-block mb-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {causeOrganization?.name}
          </Link>

          {/* Title & Description */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
            <Link to={`/causes/${causeId}`}>{causeTitle}</Link>
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
            {causeDescription}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            ${causeCurrentAmount?.toLocaleString() || 0}
                        </span>
              <span className="text-sm font-medium text-gray-700">
                            ${causeGoalAmount?.toLocaleString() || 0}
                        </span>
            </div>
            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                  className={`absolute left-0 h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-1 text-right">
                        <span className={`text-xs font-medium ${isCompleted ? 'text-green-500' : 'text-blue-500'}`}>
                            {progressPercentage.toFixed(1)}% Funded
                        </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{causeDonorCount || 0} Donors</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{causeViewCount || 0} Views</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(causeEndDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            {isCompleted ? (
                <button
                    disabled
                    className="flex-1 bg-gray-100 text-gray-400 py-2.5 px-4 rounded-lg cursor-not-allowed text-sm font-medium"
                >
                  Goal Reached
                </button>
            ) : (
                <button
                    onClick={handleDonateClick}
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Donate Now
                </button>
            )}
            <Link
                to={`/causes/${causeId}`}
                className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium group"
            >
              Details
              <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
          {/* Custom Alert for Deletion */}
          {showAlert && (
              <CustomAlert
                  message="Are you sure you want to delete this cause? This action cannot be undone."
                  onConfirm={confirmDelete}
                  onCancel={() => setShowAlert(false)}
                  isLoading={loadingDelete}
              />
          )}
      </>
  );
};

export default CauseCard;