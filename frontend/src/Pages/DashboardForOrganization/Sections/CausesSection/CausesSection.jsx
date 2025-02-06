import { useState, useEffect } from "react";
import CauseCard from "../../../../components/CausesComponents/CauseCard.jsx";
import { getOrganizationCauses } from "../../../../DataFetching/DataFetching.js";
import { useAuthContext } from "../../../../Context/AuthContext.jsx";
import { Link } from "react-router-dom";
import CauseCardSkeleton from "../../../../components/Skeletons/CauseCard/CauseCardSkeleton.jsx";

const CausesSection = () => {
    const [organizationCauses, setOrganizationCauses] = useState([]);
    const { userOrganisation } = useAuthContext();
    const [causesLoading, setCausesLoading] = useState(false);
    const [causesError, setCausesError] = useState(null);
    const organizationId = userOrganisation?.id;

    const fetchOrganizationCauses = async () => {
        try {
            setCausesLoading(true);
            const response = await getOrganizationCauses(organizationId);
            setOrganizationCauses(response?.data?.data?.content);
            setCausesError(null);
        } catch (error) {
            setCausesError(error);
        } finally {
            setCausesLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizationCauses();
    }, [organizationId]);

    if (causesError) {
        return (
            <div className="p-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-600">
                    Error: {causesError.message}
                </div>
            </div>
        );
    }

    return (
        <div className="p-0">
            {/* Header and Create Cause Button */}
            <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-md p-4">
                <h4 className="text-2xl font-bold text-gray-800">Your Causes</h4>
                {/*verify status*/}
                {userOrganisation?.isVerified ? (
                    <Link
                        to={`/Cause/CreateCause/${organizationId}`}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                        Create Cause
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        {/* Icon for Visual Feedback */}
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-yellow-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        {/* Verification Message and CTA */}
                        <div>
                            <p className="text-gray-600">Your organization needs to be verified to create causes.</p>
                        </div>
                    </div> )}
            </div>

            {/* Loading State */}
            {causesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
<CauseCardSkeleton key={index} />
                    ))}
                </div>
            ) : organizationCauses?.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">You have no causes yet.</p>
                </div>
            )
                :  (
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
            )}
        </div>
    );
};

export default CausesSection;