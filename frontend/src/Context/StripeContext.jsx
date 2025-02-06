import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import {
    getOrganizationOnboardingLink,
    getOrganizationStripeAccountStatus,
    getOrganizationDashboard
} from "../DataFetching/DataFetching";

export const StripeContext = createContext();

export const useStripeContext = () => {
    return useContext(StripeContext);
};

export const StripeContextProvider = ({ children }) => {
    const { authUser, userOrganisation } = useAuthContext();
    const [stripeAccountStatus, setStripeAccountStatus] = useState(null);
    const [onboardingLink, setOnboardingLink] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Stripe account status
    const fetchStripeAccountStatus = async () => {
        try {
            const response = await getOrganizationStripeAccountStatus(userOrganisation?.id);
            setStripeAccountStatus(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching stripe account status:", error);
            setError(error);
            return null;
        }
    };

    // Fetch Stripe onboarding link
    const fetchOnboardingLink = async () => {
        try {
            const response = await getOrganizationOnboardingLink(userOrganisation?.id);
            setOnboardingLink(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching onboarding link:", error);
            setError(error);
            return null;
        }
    };

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        if (!userOrganisation?.stripeAccountId) {
            setDashboardData(null);
            return;
        }

        try {
            const response = await getOrganizationDashboard(userOrganisation.stripeAccountId);
            setDashboardData(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(error);
            return null;
        }
    };

    // Initialize all Stripe data
    const initializeStripeData = async () => {
        setLoading(true);
        setError(null);

        try {
            const status = await fetchStripeAccountStatus();
            await fetchOnboardingLink();

            // Only fetch dashboard data if we have a Stripe account and it's enabled
            if (userOrganisation?.stripeAccountId && status?.status !== "DISABLED") {
                await fetchDashboardData();
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial data when organization ID changes
    useEffect(() => {
        if (userOrganisation?.id) {
            initializeStripeData();
        }
    }, [userOrganisation?.id]);

    const stripeState = {
        stripeAccountStatus,
        onboardingLink,
        dashboardData,
        loading,
        error,
        isStripeEnabled: Boolean(
            userOrganisation?.stripeAccountId &&
            stripeAccountStatus &&
            stripeAccountStatus.status !== "DISABLED"
        ),
        refreshData: initializeStripeData
    };

    return (
        <StripeContext.Provider value={stripeState}>
            {children}
        </StripeContext.Provider>
    );
};

export default StripeContextProvider;