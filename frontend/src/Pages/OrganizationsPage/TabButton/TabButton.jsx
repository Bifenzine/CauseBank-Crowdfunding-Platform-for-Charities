
const TabButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            active
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-2"
                : "bg-white text-gray-600 hover:bg-gray-50 border-2"
        }`}
    >
        {icon}
        {label}
    </button>
);

export default TabButton;