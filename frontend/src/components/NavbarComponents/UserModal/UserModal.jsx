import { useNavigate } from 'react-router-dom';
import { User, DollarSign, Heart, LogOut, Plus } from 'lucide-react';
import useLogout from "../../../Hooks/AuthHooks/useLogout";
import { useAuthContext } from "../../../Context/AuthContext";

export const UserModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { authUser } = useAuthContext();

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: "My Profile",
      link: `/profile/${authUser?.id}`,
      type: "link"
    },
    {
      icon: <Plus className="w-4 h-4" />,
      label: "Create Cause",
      link: "/Cause/CreateCause",
      type: "link"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: "My Donations",
      type: "button"
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: "Favorite Causes",
      type: "button"
    }
  ];

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
      <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
        {/* Header Section */}
        <div className="p-4 bg-gradient-to-br from-[#96b3d9] to-[#3767a6] rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">
                                {authUser?.lastName?.[0] || "U"}
                            </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-white truncate">
                {authUser?.lastName}
              </p>
              <p className="text-sm text-white/80 truncate">
                {authUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item, index) => (
              item.type === "link" ? (
                  <button
                      key={index}
                      onClick={() => handleNavigation(item.link)}
                      className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                  >
                            <span className="mr-3 text-gray-400 group-hover:text-[#3767a6]">
                                {item.icon}
                            </span>
                    {item.label}
                  </button>
              ) : (
                  <button
                      key={index}
                      onClick={onClose}
                      className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                  >
                            <span className="mr-3 text-gray-400 group-hover:text-[#3767a6]">
                                {item.icon}
                            </span>
                    {item.label}
                  </button>
              )
          ))}
        </div>

        {/* Sign Out Button */}
        <div className="p-2">
          <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 group"
          >
            <LogOut className="w-4 h-4 mr-3 group-hover:text-red-600" />
            Sign out
          </button>
        </div>
      </div>
  );
};

export default UserModal;