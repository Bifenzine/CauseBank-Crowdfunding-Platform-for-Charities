import React, { useEffect, useState } from "react";
import { FaUsers, FaHandHoldingHeart } from "react-icons/fa";
import {
  getOrganizationOnboardingLink,
  getOrganizationStripeAccountStatus,
} from "../../DataFetching/DataFetching";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import {useStripeContext} from "../../Context/StripeContext.jsx";

const OrganizationStats = ({ organization }) => {
  const { authUser } = useAuthContext();
  const { stripeAccountStatus, onboardingLink, loading } = useStripeContext();


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Organization Status</h2>

        <div className="space-y-4">
          <div className="space-y-4 grid grid-cols-1 ">
            {/* Organization Verification Status */}
            <div
              className={`p-4 rounded-lg border ${
                organization?.isVerified
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-yellow-600 bg-yellow-50"
              }`}>
              <span
                className={`text-base font-medium ${
                  organization?.isVerified
                    ? "text-emerald-800"
                    : "text-yellow-800"
                }`}>
                {organization?.isVerified
                  ? "Verified Organization"
                  : "Verification Pending"}
              </span>
              <div
                className={`mt-2 text-sm ${
                  organization?.isVerified
                    ? "text-emerald-800"
                    : "text-yellow-800"
                } opacity-75`}>
                {organization?.isVerified
                  ? "Your organization is successfully verified."
                  : "Organization in review phase."}
              </div>
            </div>


          </div>

          {/* Example stats - replace with real data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <FaUsers className="mx-auto text-emerald-500 mb-2" />
              <span className="block text-2xl font-bold text-gray-800">
                127
              </span>
              <span className="text-sm text-gray-500">Members</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <FaHandHoldingHeart className="mx-auto text-emerald-500 mb-2" />
              <span className="block text-2xl font-bold text-gray-800">45</span>
              <span className="text-sm text-gray-500">Projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-800 to-cyan-800 rounded-2xl shadow-sm p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Support This Cause</h2>
        <p className="text-emerald-100 text-sm mb-4">
          Your contribution helps us continue our mission and make a real
          difference.
        </p>
        <button className="w-full bg-white text-emerald-800 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors">
          Make a Donation
        </button>
      </div>
    </div>
  );
};

export default OrganizationStats;
