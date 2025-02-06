import React, {useMemo} from 'react';
import {useLocation} from "react-router-dom";

const StatusSelector = ({ selectedStatus, onStatusChange, statusOptions }) => {
    const location = useLocation();

    const filteredStatusOptions = useMemo(() => {
        // For create page, only show DRAFT and ACTIVE
        if (location.pathname.startsWith('/Cause/CreateCause/')) {
            return statusOptions?.filter(status =>
                ['DRAFT', 'ACTIVE'].includes(status)
            );
        } else if (location.pathname.startsWith('/Causes')) {
            return statusOptions?.filter(status =>
                ['ACTIVE', 'COMPLETED'].includes(status)
            );
        }

        // For edit page or other pages, show all statuses
        return statusOptions;
    }, [statusOptions, location.pathname]);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Status
            </label>
            <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="mt-1 block w-full py-2 rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
                {filteredStatusOptions?.map((status, index) => (
                    <option key={index} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StatusSelector;