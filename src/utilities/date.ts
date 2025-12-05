export function formatDate(isoString: string) {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return formatter.format(date);
}

export const formatDateForInput = (dateString: string | Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};