import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import { BsPeople } from "react-icons/bs";
import {
  getOrganizationOfAuthenticatedUser,
  getOrganizationStripeAccountStatus,
} from "../../../DataFetching/DataFetching";

const SettingsSection = ({ user, userId }) => {
  const [activeSection, setActiveSection] = useState("personal");
  const [userOrganization, setUserOrganization] = useState(null);
  const [stripeAccountStatus, setStripeAccountStatus] = useState(null);
  const [loadingUserOrganization, setLoadingUserOrganization] = useState(true);

  useEffect(() => {
    setLoadingUserOrganization(true);
    getOrganizationOfAuthenticatedUser(userId)
      .then((response) => {
        setUserOrganization(response.data);
        setLoadingUserOrganization(false);
      })
      .catch((error) => {
        console.error("Error fetching user organization:", error);
      });
  }, [userId]);

  useEffect(() => {
    getOrganizationStripeAccountStatus(userOrganization?.id)
      .then((response) => {
        setStripeAccountStatus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stripe account status:", error);
      });
  }, [userOrganization?.id]);

  const Section = ({ title, icon: Icon, content, id }) => (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <button
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {activeSection === id ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {activeSection === id && (
        <div className="px-6 py-4 border-t border-gray-100">{content}</div>
      )}
    </div>
  );

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lastLogin = new Date(user.lastLoginAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Section
        id="personal"
        title="Personal Information"
        icon={User}
        content={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <div className="flex justify-center items-center space-x-2">
                <p className="font-medium">{user?.email}</p>
                {user?.isEmailVerified && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <div className="flex justify-center items-center space-x-2">
                <p className="font-medium">{user?.phone}</p>
                {user?.isPhoneVerified && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        }
      />

      {user?.role === "ORGANIZATION" && (
        <Section
          id="organization"
          title="Organization Information"
          icon={BsPeople}
          content={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-center items-center space-x-2">
                  <p className="font-medium">{userOrganization?.name}</p>
                  {userOrganization?.isVerified ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center space-x-2">
                <p className="font-medium">payment status</p>
                {stripeAccountStatus?.status === "ACTIVE" ? (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {stripeAccountStatus?.status}
                  </span>
                ) : stripeAccountStatus?.status === "PENDING" ? (
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                    {stripeAccountStatus?.status}
                  </span>
                ) : stripeAccountStatus?.status === "RESTRICTED" ? (
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    {stripeAccountStatus?.status}
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {stripeAccountStatus?.status}
                  </span>
                )}
              </div>
              <div>
                <div className="flex justify-center items-center space-x-2">
                  <Link
                    className="font-medium bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-full"
                    to={`/organization/${userOrganization?.id}`}>
                    View Organization Info
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      )}

      <Section
        id="activity"
        title="Account Activity"
        icon={Clock}
        content={
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{joinDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">{lastLogin}</p>
            </div>
          </div>
        }
      />

      <Section
        id="security"
        title="Security & Verification"
        icon={Shield}
        content={
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Email Verification
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isEmailVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {user.isEmailVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Phone Verification
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isPhoneVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {user.isPhoneVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default SettingsSection;
