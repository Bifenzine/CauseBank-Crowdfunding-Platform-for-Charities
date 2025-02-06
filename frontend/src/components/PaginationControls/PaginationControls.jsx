const PaginationControls = ({ pagination, onPageChange }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={pagination.currentPage === 0}
        onClick={() => onPageChange(pagination.currentPage - 1)}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50">
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {pagination.currentPage + 1} of {pagination.totalPages}
      </span>
      <button
        disabled={pagination.currentPage === pagination.totalPages - 1}
        onClick={() => onPageChange(pagination.currentPage + 1)}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
