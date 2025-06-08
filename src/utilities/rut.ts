export function formatRUT(value: string): string {
    // Remove all non-numeric characters except 'K' or 'k'
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();

    if (cleaned.length <= 1) return cleaned;

    // Separate the verifier digit (last character)
    const verifier = cleaned.slice(-1);
    let numbers = cleaned.slice(0, -1);

    // Format thousands separator
    numbers = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${numbers}-${verifier}`;
}
