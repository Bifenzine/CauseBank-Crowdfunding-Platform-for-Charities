
import { FaGlobe, FaHistory } from 'react-icons/fa';

const OrganizationInfo = ({ organization }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Organization Information</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
          <p className="text-gray-700">{organization.description}</p>
        </div>

        {organization.websiteUrl && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Website</h3>
            <a 
              href={organization.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
            >
              <FaGlobe />
              {organization.websiteUrl}
            </a>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Registration Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <span className="text-sm text-gray-500 block">Registration Number</span>
              <span className="font-medium">{organization.registrationNumber}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <span className="text-sm text-gray-500 block">Tax ID</span>
              <span className="font-medium">{organization.taxId}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FaHistory className="text-emerald-500" />
              <span className="text-gray-500">Created:</span>
              <span>{new Date(organization.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaHistory className="text-emerald-500" />
              <span className="text-gray-500">Last Updated:</span>
              <span>{new Date(organization.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
