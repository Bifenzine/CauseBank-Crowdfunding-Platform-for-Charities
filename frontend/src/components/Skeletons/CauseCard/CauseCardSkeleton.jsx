

const CauseCardSkeleton = () => {
    return (<div
        className="bg-white/50 border border-gray-100 rounded-lg shadow-sm p-4 animate-pulse"
    >
        <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
    </div>
    );
}

export default CauseCardSkeleton;