import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AccountIDDisplay = ({ accountId }) => {
    const [isMinimized, setIsMinimized] = useState(true);

    const toggleMinimize = () => {
        setIsMinimized((prevIsMinimized) => !prevIsMinimized);
    };

    return (
        <div className="absolute top-0 right-0 flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
        <span className="text-gray-600 font-medium text-sm">
          {isMinimized ? 'View Account ID' : 'Account ID:'}
        </span>
                {!isMinimized && (
                    <span className="text-blue-600 font-semibold text-sm tracking-wider">
            {accountId}
          </span>
                )}
            </div>
            <button
                onClick={toggleMinimize}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label={isMinimized ? 'Show Account ID' : 'Hide Account ID'}
            >
                {isMinimized ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
        </div>
    );
};

export default AccountIDDisplay;