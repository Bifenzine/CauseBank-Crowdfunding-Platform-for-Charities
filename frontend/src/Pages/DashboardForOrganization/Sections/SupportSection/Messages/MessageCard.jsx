

const MessageCard = ({ sender, text, timestamp }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-black">{sender}</p>
                <p className="text-xs text-gray-800">{timestamp}</p>
            </div>
            <p className="text-sm text-gray-900">{text}</p>
        </div>
    );
};

export default MessageCard;