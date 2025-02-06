
import MessageCard from "./MessageCard.jsx";

const MessagesContainer = ({ messages }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h5 className="text-xl font-semibold text-black mb-4">Messages from Admin</h5>
            <div className="space-y-2">
                {messages.map((message) => (
                    <MessageCard
                        key={message.id}
                        sender={message.sender}
                        text={message.text}
                        timestamp={message.timestamp}
                    />
                ))}
            </div>
        </div>
    );
};

export default MessagesContainer;