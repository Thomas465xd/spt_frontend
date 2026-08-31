import { Countries, CountryEnum } from "../types";

export function formatPhone(phone: string, country?: CountryEnum): string {
	// Remove any non-numeric characters
	const cleaned = phone.replace(/\D/g, "");

	const resolvedCountry = country
		? country
		: (localStorage.getItem("country") as Countries);

	switch (resolvedCountry) {
		case Countries.Chile: {
			// Chilean mobile: 9 digits -> "9 9999 9999"
			const match = cleaned.match(/(\d{1})(\d{4})(\d{4})$/);
			return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
		}
		case Countries.Peru: {
			// Peruvian mobile: 9 digits -> "999 999 999"
			const match = cleaned.match(/(\d{3})(\d{3})(\d{3})$/);
			return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
		}
		// TODO: Bsale Colombia is not yet implemented
		case Countries.Colombia: {
			const match = cleaned.match(/(\d{1})(\d{4})(\d{4})$/);
			return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
		}
		default: {
			const match = cleaned.match(/(\d{1})(\d{4})(\d{4})$/);
			return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
		}
	}
}
