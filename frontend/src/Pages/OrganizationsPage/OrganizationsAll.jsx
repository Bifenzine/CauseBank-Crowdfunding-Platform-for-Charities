import React, { useState, useEffect } from "react";
import OrganizationCard from "../../components/OrganizationComponents/OrganizationCard";
import CreateOrganizationModal from "../../components/OrganizationComponents/CreateOrganizationModel/CreateOrganizationModal";
import { FaSearch, FaFilter, FaSpinner } from "react-icons/fa";
import {
  getAllOrganizations,
  getOrganizationOfAuthenticatedUser,
} from "../../DataFetching/DataFetching";
import { useAuthContext } from "../../Context/AuthContext";

const OrganizationsAll = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [userOrganization, setUserOrganization] = useState(null);
  const { authUser } = useAuthContext();
  console.log("authuser", authUser);
  const [loadingUserOrganization, setLoadingUserOrganization] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await getAllOrganizations();
      if (response.data.success) {
        setOrganizations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoadingUserOrganization(true);
    getOrganizationOfAuthenticatedUser(authUser?.id)
      .then((response) => {
        setUserOrganization(response.data);
        setLoadingUserOrganization(false);
      })
      .catch((error) => {
        console.error("Error fetching user organization:", error);
      });
  }, [authUser?.id]);

  // console.log("User Organization:", userOrganization);

  const handleModalStat = () => {
    setShowModal(!showModal);
  };

  const handleOrganizationCreated = () => {
    fetchOrganizations();
    setShowModal(false);
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "ALL" ||
      (filter === "VERIFIED" && org.isVerified) ||
      (filter === "UNVERIFIED" && !org.isVerified);
    return matchesSearch && matchesFilter;
  });

  const handleUserRedirect = () => {
    if (userOrganization) {
      window.location.href = `/organization/${userOrganization.id}`;
    } else {
      handleModalStat();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0">
            {loadingUserOrganization ? (
              <button>
                <FaSpinner className="animate-spin" />
              </button>
            ) : (
              <button
                onClick={handleUserRedirect}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                {userOrganization
                  ? "You already have an organization"
                  : "Create Organization"}
              </button>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Supporting Organizations
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and support verified organizations making a real difference
            in communities worldwide.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                filter === "ALL"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              All
            </button>
            <button
              onClick={() => setFilter("VERIFIED")}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                filter === "VERIFIED"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              Verified Only
            </button>
            <button
              onClick={() => setFilter("UNVERIFIED")}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                filter === "UNVERIFIED"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              Unverified
            </button>
          </div>
        </div>

        {/* Organizations Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading organizations...</p>
          </div>
        ) : filteredOrganizations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-600">
              No organizations found matching your criteria.
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <CreateOrganizationModal
            handleModalStat={handleModalStat}
            onSuccess={handleOrganizationCreated}
          />
        )}
      </div>
    </div>
  );
};

export default OrganizationsAll;
