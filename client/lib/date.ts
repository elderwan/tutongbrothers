/**
 * Formats an ISO 8601 date string (e.g., "2025-09-26T08:50:14.362Z")
 * to the simple "YYYY-MM-DD HH:MM" format.
 * * This method relies on string manipulation, ensuring the exact UTC time 
 * from the input is displayed without local timezone conversion.
 *
 * @param {string | null | undefined} isoString The date string in ISO format.
 * @returns {string} The formatted date string, or an empty string if the input is invalid.
 */
export function dateFormat(isoString: string | null | undefined): string {
    if (!isoString || typeof isoString !== "string") {
        return "";
    }

    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return isoString.slice(0, 10); // fallback: YYYY-MM-DD
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const year = date.getFullYear();

    const pad = (num: number) => String(num).padStart(2, "0");

    const fullDate = `${year}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    // 如果是今年，去掉年份
    return year === currentYear ? fullDate.slice(5) : fullDate;
}

