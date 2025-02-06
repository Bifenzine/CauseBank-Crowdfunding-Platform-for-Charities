// utils/formatDate.js
// utils/formatDate.js
export const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
        year: 'numeric', // Include the year
        month: 'short',  // Short month name (e.g., "Oct")
        day: 'numeric',  // Day of the month (e.g., "25")
        hour: '2-digit', // Hour in 12-hour format (e.g., "02")
        minute: '2-digit', // Minute (e.g., "30")
        second: '2-digit', // Optional: Include seconds (e.g., "45")
        hour12: true,     // Use 12-hour format (e.g., "2:30 PM")
    });
};