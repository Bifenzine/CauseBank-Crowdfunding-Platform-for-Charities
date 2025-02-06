
import SectionHeader from "./SectionHeader";
import MessagesContainer from "./Messages/MessagesContainer.jsx";

const SupportSection = () => {
    // Example messages from the admin
    const messages = [
        {
            id: 1,
            sender: "Admin",
            text: "Hello! How can we assist you today?",
            timestamp: "2024-01-01 10:00 AM",
        },
        {
            id: 2,
            sender: "Admin",
            text: "Your issue has been resolved. Let us know if you need further assistance.",
            timestamp: "2024-01-02 11:30 AM",
        },
        {
            id: 3,
            sender: "Admin",
            text: "Thank you for contacting support!",
            timestamp: "2024-01-03 09:15 AM",
        },
    ];

    const handleNewMessage = () => {
        // Logic to handle new message
        console.log("New message button clicked");
    };

    return (
        <div className="p-0 max-w-6xl mx-auto">
            {/* Header */}
            <SectionHeader
            />

            {/* Messages Container */}
            <MessagesContainer messages={messages} />
        </div>
    );
};

export default SupportSection;