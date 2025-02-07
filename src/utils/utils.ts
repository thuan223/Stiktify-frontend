export const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDateTimeVn = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
};

export const formatNumber = (value: number) => {
    if (value >= 1_000_000) return (value / 1_000_000) + 'M';
    if (value >= 1_000) return (value / 1_000) + 'K';
    return value.toString();
}