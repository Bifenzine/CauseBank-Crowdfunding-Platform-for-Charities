import RefreshButton from "../RefreshBtnStripeApi/RefreshButton.jsx";
import {useStripeContext} from "../../Context/StripeContext.jsx";
import {useState} from "react";
import AccountIDDisplay from "./AccountIdDisplay.jsx";

const AccountOverview = ({ businessName, email, logoUrl, accountId, isActive }) => {
    const {loading, refreshData } = useStripeContext();
    const [isMinimized, setIsMinimized] = useState(true);

    const toggleMinimize = () => {
        setIsMinimized((prevIsMinimized) => !prevIsMinimized);
    }

    return (
        <div className="bg-white flex flex-col md:flex-row items-center justify-between rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative
        mb-4">
            {/* Logo and Business Info */}
            <div className="flex items-center space-x-2 mt-4">
                <div>
                    <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{businessName}</h1>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                            {email}
                        </span>
                        {isActive && (
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                                Active Account
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Account ID */}
            <AccountIDDisplay accountId={accountId} />

            {/* Refresh Button */}
            <div className="absolute bottom-4 right-4">
                <RefreshButton loading={loading} onRefresh={refreshData}  />
            </div>
        </div>
    );
};

export default AccountOverview;