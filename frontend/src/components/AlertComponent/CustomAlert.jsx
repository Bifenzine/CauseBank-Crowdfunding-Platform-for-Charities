

// eslint-disable-next-line react/prop-types
const CustomAlert = ({ message, onConfirm, onCancel, isLoading }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <p className="text-lg text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        {isLoading ? "Deleting..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;