import AccountOverview from "../../../../components/OrganizationDashbordComponents/AccountOverview.jsx";
import BalanceCards from "../../../../components/OrganizationDashbordComponents/BalanceCard.jsx";
import TransactionsTable from "../../../../components/OrganizationDashbordComponents/TransactionsTable.jsx";
import TransactionTableSkeleton from "../../../../components/Skeletons/TransactionTable/TransactionTableSkeleton.jsx";
import React from "react";

const TransactionsSection = ({ dashboardData, userOrganisation, loading }) => {
    const LoadingOverlay = () => (
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 animate-pulse">
            {/* Placeholder for the title */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

            {/* Placeholder for the amount */}
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
    );

    return (
        <>
            <AccountOverview
                businessName={dashboardData?.businessProfile?.name}
                email={dashboardData?.email}
                logoUrl={userOrganisation?.logoUrl}
                accountId={dashboardData?.id}
                isActive={userOrganisation?.isActive}
            />
            {loading ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <LoadingOverlay key={index}/>
                        ))}
                    </div>
                    <TransactionTableSkeleton/>
                </>
            ) : (
                <>
                    <BalanceCards
                        balance={dashboardData?.balance}
                        payoutSchedule={dashboardData?.payoutSchedule}
                    />
                    <TransactionsTable
                        transactions={dashboardData?.recentTransactions}
                    />
                </>
            )}
        </>
    );
};

export default TransactionsSection;