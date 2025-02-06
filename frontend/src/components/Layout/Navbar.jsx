import { useState, useRef, useEffect } from "react";
import {Link, NavLink} from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import {navLinks} from "../../Constants/navLink.js";
import MobileProfileDrawer from "./MobileProfileDrawer";
import { UserModal } from "../NavbarComponents/UserModal/UserModal";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { authUser } = useAuthContext();
    const modalRef = useRef();
    const mobileMenuRef = useRef();

    // // Navigation Links
    // const navLinks = [
    //     { path: "/", label: "Home" },
    //     { path: "/causes", label: "Causes" },
    //     { path: "/about", label: "About" },
    //     { path: "/contact", label: "Contact" }
    // ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleModalOpen = (e) => {
        e.stopPropagation();
        setIsModalOpen(!isModalOpen);
    };

    return (
        <nav className="bg-white w-full z-50 shadow-md relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/causebankZ.png"
                                alt="causeLogo"
                                className="h-14 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <NavLink key={link.path} to={link.path}
                            className="font-medium hover:text-[#3767a6] transition-colors duration-200">
                                {link.label}
                            </NavLink>
                        ))}

                        <div ref={modalRef} className="relative z-50">
                            {authUser ? (
                                <button
                                    onClick={handleModalOpen}
                                    className="bg-gradient-to-br from-[#96b3d9] to-[#3767a6] text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                                    Profile - {authUser.lastName}
                                </button>
                            ) : (
                                <Link to="/signin">
                                    <button className="bg-gradient-to-br from-[#96b3d9] to-[#3767a6] text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                                        Sign in
                                    </button>
                                </Link>
                            )}
                            <UserModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                isMobile={false}
                            />
                        </div>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-[#3767a6] p-2 transition-colors duration-200">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                {isOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                ref={mobileMenuRef}
                className={`lg:hidden fixed inset-0 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
                <div className="relative bg-white h-full w-64 shadow-xl">
                    <div className="pt-20 pb-3 space-y-3">
                        {navLinks.map((link) => (
                            <div key={link.path} className="px-4">
                                <NavLink to={link.path} isMobile onClick={() => setIsOpen(false)}>
                                    {link.label}
                                </NavLink>
                            </div>
                        ))}
                        <div className="px-4 mt-4">
                            {authUser ? (
                                <button
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="w-full bg-gradient-to-br from-[#96b3d9] to-[#3767a6] text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                                    Profile - {authUser.lastName}
                                </button>
                            ) : (
                                <Link to="/signin">
                                    <button className="w-full bg-gradient-to-br from-[#96b3d9] to-[#3767a6] text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                                        Sign in
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Profile Drawer */}
            <MobileProfileDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setIsOpen(false);
                }}
            />
        </nav>
    );
};

export default Navbar;