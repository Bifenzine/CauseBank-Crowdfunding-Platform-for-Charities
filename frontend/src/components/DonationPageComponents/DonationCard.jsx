import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Heart, TrendingUp } from 'lucide-react';

const DonationCard = ({ donation }) => {
    const statusConfig = {
        COMPLETED: {
            icon: CheckCircle,
            gradient: 'from-green-400 to-emerald-600',
            bgGradient: 'from-green-50 to-emerald-50',
            textColor: 'text-emerald-700'
        },
        PENDING: {
            icon: Clock,
            gradient: 'from-yellow-400 to-amber-600',
            bgGradient: 'from-yellow-50 to-amber-50',
            textColor: 'text-amber-700'
        },
        FAILED: {
            icon: AlertCircle,
            gradient: 'from-red-400 to-rose-600',
            bgGradient: 'from-red-50 to-rose-50',
            textColor: 'text-rose-700'
        }
    };

    const Icon = statusConfig[donation.status]?.icon;

    const getDonorName = () => {
        if (donation?.isAnonymous || !donation?.donor) return 'Anonymous Donor';
        return `${donation?.donor?.firstName} ${donation?.donor?.lastName}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link to={`/causes/${donation?.cause?.id}`} className="block group">
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${statusConfig[donation?.status].bgGradient} p-1`}>
                <div className="bg-white rounded-lg p-6">
                    {/* Top Section with Amount */}
                    <div className="relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`text-3xl font-bold bg-gradient-to-r ${statusConfig[donation?.status].gradient} bg-clip-text text-transparent`}>
                                ${donation?.amount.toLocaleString()}
                            </div>
                            <div className={`flex items-center space-x-2 ${statusConfig[donation.status].textColor} text-sm font-medium`}>
                                <Icon className="w-5 h-5" />
                                <span>{donation?.status.charAt(0) + donation?.status.slice(1).toLowerCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cause Information */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-gray-100 rounded-full p-2 group-hover:bg-gray-200 transition-colors">
                                <Heart className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700">
                                    {donation?.cause?.title}
                                </h3>
                                <p className="text-sm text-gray-500">{formatDate(donation?.createdAt)}</p>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        {getDonorName().charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{getDonorName()}</p>
                                    <p className="text-xs text-gray-500">Donor</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default DonationCard;