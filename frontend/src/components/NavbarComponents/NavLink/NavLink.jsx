import React from "react";
import { Link } from "react-router-dom";

export const NavLink = ({ to, children, isMobile = false }) => {
  const baseClasses =
    "text-gray-700 hover:text-[#3767a6] font-medium transition-colors duration-200";
  const mobileClasses = "block px-4 py-3 hover:bg-green-50 rounded-lg";

  return (
    <Link to={to} className={`${baseClasses} ${isMobile ? mobileClasses : ""}`}>
      {children}
    </Link>
  );
};
