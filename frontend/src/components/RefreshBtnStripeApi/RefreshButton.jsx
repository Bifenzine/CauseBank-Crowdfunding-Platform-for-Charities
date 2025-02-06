import {BiRefresh} from "react-icons/bi";

// Separate refresh button component
const RefreshButton = ({ loading, onRefresh }) => (
    <button
        onClick={onRefresh}
        disabled={loading}
        className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
        <span className="text-sm font-medium">Refresh</span>
        <BiRefresh className={`text-lg ${loading ? "animate-spin" : ""}`} />
    </button>
);

export default RefreshButton;