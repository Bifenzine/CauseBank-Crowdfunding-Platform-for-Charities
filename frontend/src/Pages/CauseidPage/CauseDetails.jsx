import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaShare, FaClock, FaUsers, FaEye } from "react-icons/fa";
import { getCauseDetail } from "../../DataFetching/DataFetching";
import useDeleteCause from "../../Hooks/CauseHooks/useDeleteCause";
import { useAuthContext } from "../../Context/AuthContext";
import CauseMedia from "../../components/causeMedia/CauseMedia.jsx";
import DropdownMenu from "../../components/CausesComponents/DropdownMenu/DropdownMenu.jsx";
import CustomAlert from "../../components/AlertComponent/CustomAlert.jsx";

const CauseDetails = () => {
  const { id } = useParams();
  const { authUser } = useAuthContext();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { deleteCause, loadingDelete } = useDeleteCause();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCauseDetails = async () => {
      try {
        const response = await getCauseDetail(id);
        setCause(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCauseDetails();
  }, [id]);

  // Handle Delete Action
  const handleDelete = () => {
    setShowAlert(true);
  };
  const confirmDelete = async () => {
    try {
      await deleteCause(id); // Use the delete hook
      setShowAlert(false);
      // window.location.href = `/`; // Redirect after deletion
    } catch (error) {
      console.error("Error deleting cause:", error);
    }
  };

  // Handle Update Action
  const handleUpdate = () => {
    // Navigate to the update page
    navigate(`/updatecause/${id}`);
  };

  const causeAuthor = cause?.organization?.userId;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">Error Loading Cause</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (cause?.currentAmount / cause?.goalAmount) * 100;
  const daysLeft = Math.ceil(
    (new Date(cause?.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isCompleted = cause?.status === 'COMPLETED' || cause?.currentAmount >= cause?.goalAmount;

  return (
      <>

    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cause?.featuredImageUrl}
            alt={cause?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        {isCompleted && (
          <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 text-lg font-semibold">
            Goal Reached!
          </div>
        )}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white">
            <div className="flex items-center gap-4 mb-4">
              <Link to={`/organization/${cause?.organization?.id}`}>
                <img
                  src={cause?.organization?.logoUrl}
                  alt={cause?.organization?.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              </Link>
              <div>
                <Link to={`/organization/${cause?.organization?.id}`}>
                  <h3 className="font-medium">{cause?.organization?.name}</h3>
                </Link>
                <p className="text-sm text-gray-300">Verified Organization</p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {cause?.title}
            </h1>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2">
                <FaUsers /> {cause?.donorCount} Donors
              </span>
              <span className="flex items-center gap-2">
                <FaEye /> {cause?.viewCount} Views
              </span>
              <span className="flex items-center gap-2">
                <FaClock /> {daysLeft} Days Left
              </span>
            </div>
          </motion.div>
          {/* delete cause btn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4">
            {causeAuthor === authUser?.id && (
                <div className="absolute top-4 right-4">
                  <DropdownMenu onDelete={handleDelete} onUpdate={handleUpdate}/>
                </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cause Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About this cause</h2>
              <p className="text-gray-600 leading-relaxed">
                {cause?.description}
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <CauseMedia />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Organization Details</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {cause?.organization?.description}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    Website: {cause?.organization?.websiteUrl}
                  </p>
                  <p className="text-sm text-gray-500">
                    Location: {cause?.organization?.city},{" "}
                    {cause?.organization?.country}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Donation Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">
                    ${cause?.currentAmount?.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    of ${cause?.goalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{progressPercentage?.toFixed(1)}% Raised</span>
                  <span>{daysLeft} Days Left</span>
                </div>
              </div>
              
              {isCompleted ? (
                <button 
                  disabled
                  className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed mb-4"
                  title="This cause has reached its goal">
                  Goal Reached
                </button>
              ) : (
                <Link to={`/donate/${cause?.id}`} className="mb-4">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4">
                    Donate Now
                  </button>
                </Link>
              )}

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHeart className="text-red-500" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaShare className="text-blue-500" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
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

export default CauseDetails;