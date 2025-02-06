const formatDateToZonedDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().replace("Z", "+00:00");
};

export default formatDateToZonedDateTime;