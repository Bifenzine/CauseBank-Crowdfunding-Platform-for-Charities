
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import useDeleteOrganization from "../../Hooks/OrganizationHooks/useDeleteOrganization";
import { useAuthContext } from "../../Context/AuthContext";

// eslint-disable-next-line react/prop-types
const OrganizationHeader = ({ organization }) => {
  const { authUser , userRole } = useAuthContext();
  const { id } = useParams();


  return (
    <div className="bg-gradient-to-br from-emerald-800 to-cyan-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={organization.logoUrl}
            alt={organization.name}
            className="w-32 h-32 rounded-2xl object-cover bg-white p-2"
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{organization?.name}</h1>
              {organization.isVerified ? (
                <FaCheckCircle className="text-emerald-300 text-xl" />
              ) : (
                <FaClock className="text-yellow-300 text-xl" />
              )}
            </div>

            <p className="text-emerald-100 mb-4">{organization.description}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="bg-white/10 px-4 py-2 rounded-lg text-sm">
                Reg. No: {organization.registrationNumber}
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-lg text-sm">
                Tax ID: {organization.taxId}
              </span>
            </div>
          </div>
        </div>
        {userRole === "ORGANIZATION" && authUser?.id === organization.userId && (
            <div className="absolute top-6 right-6">
              <Link to={`/dashboard/${authUser?.id}`}>
                <button
                    className="bg-white/20 hover:border px-4 py-2 rounded-lg text-sm"
                >
                  Dashboard
                </button>
              </Link>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default OrganizationHeader;
