import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { getAllDonations } from '../../DataFetching/DataFetching';
import DonationCard from '../../components/DonationPageComponents/DonationCard.jsx';

const DonationsPage = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchDonations = async () => {
        try {
            const response = await getAllDonations();
            setDonations(response.data.data.content);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchDonations();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Recent Donations</h1>
                    <p className="text-gray-600 mt-2">Watch the generosity flow in real-time</p>
                </div>

                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations?.map((donation) => (
                    <DonationCard key={donation?.id} donation={donation} />
                ))}
            </div>

            {donations.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No donations found</p>
                </div>
            )}
        </div>
    );
};

export default DonationsPage;