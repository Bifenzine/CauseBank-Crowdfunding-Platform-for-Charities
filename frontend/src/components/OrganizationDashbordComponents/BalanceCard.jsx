import React from "react";

const BalanceCard = ({ title, amount, currency, textColorClass }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
        </h3>
        <p className={`text-2xl font-bold ${textColorClass} mt-2`}>
            {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(amount / 100)}
        </p>
    </div>
);

const PayoutScheduleCard = ({ interval, delayDays }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Payout Schedule
        </h3>
        <p className="text-lg font-medium mt-2">Every {interval || "daily"}</p>
        <p className="text-sm text-gray-500 mt-1">{delayDays} day(s) delay</p>
    </div>
);

const BalanceCards = ({ balance, payoutSchedule }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Available Balance */}
            <BalanceCard
                title="Available Balance"
                amount={balance?.available}
                currency={balance?.currency}
                textColorClass="text-green-600"
            />

            {/* Instant Available Balance */}
            <BalanceCard
                title="Instant Available Balance"
                amount={balance?.instantAvailable}
                currency={balance?.currency}
                textColorClass="text-blue-600"
            />

            {/* Pending Balance */}
            <BalanceCard
                title="Pending Balance"
                amount={balance?.pending}
                currency={balance?.currency}
                textColorClass="text-orange-600"
            />

            {/* Payout Schedule */}
            <PayoutScheduleCard
                interval={payoutSchedule?.interval}
                delayDays={payoutSchedule?.delayDays}
            />
        </div>
    );
};

export default BalanceCards;