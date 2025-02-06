import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Edit } from "lucide-react";

const DropdownMenu = ({ onDelete, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDropdownClick = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Toggle Button */}
            <button
                onClick={handleDropdownClick}
                className="p-2 bg-white rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            >
                <MoreVertical size={20} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                    <ul className="py-1">
                        {/* Update Option */}
                        <li>
                            <button
                                onClick={() => {
                                    onUpdate();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Edit size={16} />
                                Update
                            </button>
                        </li>

                        {/* Delete Option */}
                        <li>
                            <button
                                onClick={() => {
                                    onDelete();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;