import React from 'react';
import { formatDate } from '../../Utils/FormatDate.js';
import { formatCurrency } from '../../Utils/FormatCurrency.js';

const TransactionsTable = ({ transactions }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {transactions?.map((transaction) => (
                        <tr
                            key={transaction.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                        >
                            {/* Date */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(transaction.created)}
                            </td>

                            {/* Type */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                {transaction.type.replace(/_/g, ' ')}
                            </td>

                            {/* Amount */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={
                                            transaction.amount > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }
                                    >
                                        {formatCurrency(transaction.amount, transaction.currency)}
                                    </span>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            transaction.status === 'succeeded'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                        }`}
                                    >
                                        {transaction.status}
                                    </span>
                            </td>

                            {/* Description */}
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {transaction.description || '-'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {!transactions?.length && (
                <div className="p-6 text-center text-gray-500">
                    No transactions found.
                </div>
            )}
        </div>
    );
};

export default TransactionsTable;