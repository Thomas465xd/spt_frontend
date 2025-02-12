export function formatPhone(phone: string): string {
    // Remove any non-numeric characters
    const cleaned = phone.replace(/\D/g, "");

    // Extract last 9 digits (for Chilean numbers)
    const match = cleaned.match(/(\d{1})(\d{4})(\d{4})$/);
    
    return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
}
