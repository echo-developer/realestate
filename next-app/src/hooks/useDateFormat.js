const useDateFormat = (dateTimeString) => {
    if (!dateTimeString) return "Invalid Date";

    const date = new Date(dateTimeString);

    if (isNaN(date)) return "Invalid Date";

    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = String(date.getDate()).padStart(2, "0");

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const monthName = monthNames[monthIndex];
    return `${day} ${monthName}, ${year}`;
};

export default useDateFormat;
