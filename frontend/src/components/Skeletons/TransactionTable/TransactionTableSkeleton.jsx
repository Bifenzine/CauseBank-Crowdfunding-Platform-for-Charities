const TransactionTableSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded"></div>
            ))}
        </div>
    </div>
);

export default TransactionTableSkeleton;