// components/OrganizationCard.jsx
import React from 'react';
import { FaGlobe, FaCheckCircle, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrganizationCard = ({ organization }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-emerald-800 to-cyan-800">
        <img
          src={organization.logoUrl || 'default-logo-placeholder.png'}
          alt={organization.name}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-xl border-4 border-white object-cover bg-white"
        />
      </div>
      
      <div className="pt-14 p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
            {organization.name}
            {organization.isVerified && (
              <FaCheckCircle className="text-emerald-500 text-lg" />
            )}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Reg. No: {organization.registrationNumber}
          </p>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {organization.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaMapMarkerAlt className="text-emerald-500" />
            <span>
              {organization.city}, {organization.state}, {organization.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaBuilding className="text-emerald-500" />
            <span>{organization.addressLine1}</span>
          </div>
          {organization.websiteUrl && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaGlobe className="text-emerald-500" />
              <a 
                href={organization.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-2">
             <Link 
                to={`/organization/${organization.id}`}
                className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-medium text-center"
                >
                View Details
                </Link>
          <button className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;