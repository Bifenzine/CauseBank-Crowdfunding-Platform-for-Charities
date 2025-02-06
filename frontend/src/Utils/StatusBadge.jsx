
const StatusBadge = ({status} ) => {
    const statusConfig = {
        ACTIVE: 'bg-green-400',
        DRAFT: 'bg-blue-300',
        PAUSED: 'bg-amber-500',
        COMPLETED: 'bg-teal-500',
        CANCELLED: 'bg-red-500',
        DELETED: 'bg-red-300'
    };

    const baseClasses = 'absolute bottom-4 left-4 text-white px-3 py-1 rounded-full text-sm font-bold';

    return (
        <span className={`${baseClasses} ${statusConfig[status] || 'bg-gray-400'}`}>
      {status || 'Unknown'}
    </span>
    );
};

export default StatusBadge;