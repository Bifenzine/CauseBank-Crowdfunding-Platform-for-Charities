import { useState } from "react";
import { useAuthContext } from "../../Context/AuthContext";
import { useStripeContext } from "../../Context/StripeContext";
import { Link } from "react-router-dom";
import StripeConnectModel from "../StripeComponents/StripeConnectModel/StripeConnectModel";
import RefreshButton from "../RefreshBtnStripeApi/RefreshButton.jsx";
import {useMediaQuery, useTheme} from "@mui/material";

const HeaderAccStripe = () => {
    const { authUser, userOrganisation } = useAuthContext();
    const { stripeAccountStatus, onboardingLink, loading, refreshData } = useStripeContext();
    const [openModal, setOpenModal] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenModal = () => {
        setOpenModal((prevState) => !prevState);
    };

    const renderContent = () => {
        // No Stripe account
        if (authUser?.id && !userOrganisation?.stripeAccountId) {
            return (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>

                        <div>
                            <p className={`text-gray-700 ${isSmallScreen ? 'text-center text-sm' : ''}`}>
                                {isSmallScreen
                                    ? "Connect to payment system"
                                    : "Begin your journey as an organization by connecting to our payment system."
                                }
                            </p>
                            <button
                                onClick={handleOpenModal}
                                className={`
                                    bg-gradient-to-r from-blue-500 to-blue-600 
                                    text-white px-6 py-2 rounded-lg 
                                    hover:from-blue-600 hover:to-blue-700 
                                    transition-all shadow-md mt-2
                                    ${isSmallScreen ? 'w-full' : ''}
                                `}
                            >
                                Connect Stripe
                            </button>
                        </div>
                    </div>
                    <RefreshButton loading={loading} onRefresh={refreshData} />
                </div>
            );
        }

        // Disabled Stripe account
        if (authUser?.id && userOrganisation?.stripeAccountId && stripeAccountStatus?.status === "DISABLED") {
            return (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
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

                        <div>
                            <p className={`text-gray-700 ${isSmallScreen ? 'text-center text-sm' : ''}`}>
                                {isSmallScreen
                                    ? "Stripe account disabled"
                                    : "Your Stripe account is disabled. Verify your payment info to continue."
                                }
                            </p>
                            <Link
                                className={`
                                    bg-gradient-to-r from-blue-500 to-blue-600 
                                    text-white px-6 py-2 rounded-lg 
                                    hover:from-blue-600 hover:to-blue-700 
                                    transition-all shadow-md mt-2 inline-block
                                    ${isSmallScreen ? 'w-full text-center' : ''}
                                `}
                                to={onboardingLink?.url}
                            >
                                Complete Verification
                            </Link>
                        </div>
                    </div>
                    <RefreshButton loading={loading} onRefresh={refreshData} />
                </div>
            );
        }

        // Active Stripe account
        if (authUser?.id && userOrganisation?.stripeAccountId && stripeAccountStatus?.status === "ACTIVE") {
            return (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <div>
                            <p className={`text-gray-700 font-semibold ${isSmallScreen ? 'text-center text-sm' : ''}`}>
                                {isSmallScreen ? "Stripe Account Active" : "Your Stripe account is active."}
                            </p>
                            {!isSmallScreen && (
                                <p className="text-sm text-gray-500">You're all set to receive payments.</p>
                            )}
                        </div>
                    </div>
                    <RefreshButton loading={loading} onRefresh={refreshData} />
                </div>
            );
        }

        // Default case
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-600"
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

                    <p className={`text-gray-700 ${isSmallScreen ? 'text-center text-sm' : ''}`}>
                        Payment information not available.
                    </p>
                </div>
                <RefreshButton loading={loading} onRefresh={refreshData} />
            </div>
        );
    };

    return (
        <>
            {openModal && (
                <StripeConnectModel
                    onClose={handleOpenModal}
                    userOrganization={userOrganisation}
                />
            )}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-6">
                <div>
                    {renderContent()}
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-full">
                        {userOrganisation?.isVerified ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        )}
                    </div>

                    <div>
                        <p className={`text-gray-700 ${isSmallScreen ? 'text-center text-sm' : ''}`}>
                            {userOrganisation?.isVerified
                                ? "Your organization is verified and ready to accept donations."
                                : "Your organization is not verified yet by the admin. Please complete verification to access all features."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderAccStripe;