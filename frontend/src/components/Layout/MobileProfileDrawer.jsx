import { useState } from 'react';
import { User, DollarSign, Heart, LogOut, Plus } from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import useLogout from "../../Hooks/AuthHooks/useLogout.js";
import { useAuthContext } from "../../Context/AuthContext";

const MobileProfileDrawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useLogout();
    const { authUser } = useAuthContext();
    const [isClosing, setIsClosing] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;
    const dashboardLink = currentPath.startsWith('/dashboard');

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleNavigation = (path) => {
        handleClose();
        setTimeout(() => navigate(path), 300);
    };

    const handleLogout = () => {
        handleClose();
        setTimeout(() => logout(), 300);
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="lg:hidden">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${
                    isClosing ? 'opacity-0' : 'opacity-50'
                }`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-x-0 ${dashboardLink ? 'bottom-[3rem]' : 'bottom-0'} z-50 transform transition-transform duration-300 ease-out ${
                    isClosing ? 'translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="bg-white rounded-t-2xl shadow-xl">
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#96b3d9] to-[#3767a6] flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {authUser?.lastName?.[0] || "U"}
                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {authUser?.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {authUser?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="px-2 py-3">
                        <button
                            onClick={() => handleNavigation(`/profile/${authUser?.id}`)}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            <User className="w-5 h-5 mr-3 text-gray-400" />
                            <span className="text-base">My Profile</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/Cause/CreateCause')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            <Plus className="w-5 h-5 mr-3 text-gray-400" />
                            <span className="text-base">Create Cause</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/donations')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            <DollarSign className="w-5 h-5 mr-3 text-gray-400" />
                            <span className="text-base">My Donations</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/favorites')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            <Heart className="w-5 h-5 mr-3 text-gray-400" />
                            <span className="text-base">Favorite Causes</span>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="px-2 py-3 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span className="text-base">Sign out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileProfileDrawer;