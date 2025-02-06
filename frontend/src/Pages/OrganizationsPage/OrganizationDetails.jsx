import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrganizationById, getOrganizationActiveAndCompletedCauses } from "../../DataFetching/DataFetching";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle, FaHandHoldingHeart } from "react-icons/fa";
import OrganizationStats from "../../components/OrganizationComponents/OrganizationStats";
import OrganizationContact from "../../components/OrganizationComponents/OrganizationContact";
import OrganizationHeader from "../../components/OrganizationComponents/OrganizationHeader";
import OrganizationInfo from "../../components/OrganizationComponents/OrganizationInfo";
import CauseCard from "../../components/CausesComponents/CauseCard";
import TabButton from "./TabButton/TabButton.jsx";

const OrganizationDetails = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [organizationCauses, setOrganizationCauses] = useState([]);
  const [causesLoading, setCausesLoading] = useState(true);
  const [causesError, setCausesError] = useState(null);

  const fetchOrganizationDetails = async () => {
    try {
      const response = await getOrganizationById(id);
      if (response.data.success) {
        setOrganization(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to fetch organization details");
      console.error("Error fetching organization details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationCauses = async () => {
    try {
      setCausesLoading(true);
      const response = await getOrganizationActiveAndCompletedCauses(id);
      setOrganizationCauses(response?.data?.data?.content);
      console.log("Organization causes:", response.data.data?.content);
      setCausesError(null);
    } catch (error) {
      setCausesError(error);
    } finally {
      setCausesLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationDetails();
    fetchOrganizationCauses();
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto">
              <img
                  src="/causebankZ.png"
                  alt="causeLogo"
                  className="h-14 w-auto animate-bounce"
              />
            </div>
            <p className="text-gray-600 mt-4">Loading organization details...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-xl">
            <p>{error}</p>
          </div>
        </div>
    );
  }

  const tabContent = {
    info: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <OrganizationInfo organization={organization} />
            <OrganizationContact organization={organization} />
          </div>
          <div>
            <OrganizationStats organization={organization} />
          </div>
        </div>
    ),
    causes: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizationCauses?.map((cause) => (
              <CauseCard
                  key={cause.id}
                  causeId={cause.id}
                  causeFeaturedImageUrl={cause.featuredImageUrl}
                  causeTitle={cause.title}
                  causeDescription={cause.description}
                  causeCategory={cause.category}
                  causeCountry={cause.country}
                  causeGoalAmount={cause.goalAmount}
                  causeCurrentAmount={cause.currentAmount}
                  causeOrganization={cause.organization}
                  causeDonorCount={cause.donorCount}
                  causeViewCount={cause.viewCount}
                  causeEndDate={cause.endDate}
                  causeStatus={cause.status}
              />
          ))}
        </div>
    ),
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <OrganizationHeader organization={organization} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-8">
              <TabButton
                  active={activeTab === "info"}
                  icon={<FaInfoCircle />}
                  label="Organization Info"
                  onClick={() => setActiveTab("info")}
              />
              <TabButton
                  active={activeTab === "causes"}
                  icon={<FaHandHoldingHeart />}
                  label="Active Causes"
                  onClick={() => setActiveTab("causes")}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
              >
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
};

export default OrganizationDetails;