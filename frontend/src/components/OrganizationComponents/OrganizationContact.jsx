import React from 'react';
import { FaMapMarkerAlt, FaBuilding, FaGlobe } from 'react-icons/fa';

const OrganizationContact = ({ organization }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Primary Address</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FaBuilding className="text-emerald-500 mt-1" />
              <div>
                <p className="text-gray-700">{organization.addressLine1}</p>
                {organization.addressLine2 && (
                  <p className="text-gray-700">{organization.addressLine2}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-emerald-500 mt-1" />
              <div>
                <p className="text-gray-700">
                  {organization.city}, {organization.state}
                </p>
                <p className="text-gray-700">
                  {organization.postalCode}, {organization.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-emerald-800 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-white text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
              Contact Organization
            </button>
            <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
              Support This Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationContact;
