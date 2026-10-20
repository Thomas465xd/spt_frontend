import { Countries, CountryEnum } from "../types";

export interface PhoneConfig {
	code: string; // country dialing code, e.g. "+56"
	flagCode: string; // react-flagpack flag code, e.g. "CL"
	pattern: RegExp; // validation regex (local number, no prefix)
	message: string;
	placeholder: string;
	maxLength: number; // max chars in formatted form
}

const phoneConfigs: Record<CountryEnum, PhoneConfig> = {
	Chile: {
		code: "+56",
		flagCode: "CL",
		pattern: /^9\s?\d{4}\s?\d{4}$/,
		message: "Formato inválido. Ej. 9 8765 4321",
		placeholder: "9 8765 4321",
		maxLength: 11,
	},
	Peru: {
		code: "+51",
		flagCode: "PE",
		pattern: /^\d{3}\s?\d{3}\s?\d{3}$/,
		message: "Formato inválido. Ej. 987 654 321",
		placeholder: "987 654 321",
		maxLength: 11,
	},
	Colombia: {
		code: "+57",
		flagCode: "CO",
		pattern: /^3\d{2}\s?\d{3}\s?\d{4}$/,
		message: "Formato inválido. Ej. 300 123 4567",
		placeholder: "300 123 4567",
		maxLength: 12,
	},
};

export function getPhoneConfig(country: CountryEnum): PhoneConfig {
	return phoneConfigs[country];
}

export function formatPhone(
	phone: string,
	country?: CountryEnum,
	includePrefix?: boolean,
): string {
	const cleaned = phone.replace(/\D/g, "");
	const resolvedCountry =
		country ?? (localStorage.getItem("country") as Countries);

	let formatted: string;

	switch (resolvedCountry) {
		case Countries.Chile: {
			// Progressive: 9 → 9 XXXX → 9 XXXX XXXX
			if (cleaned.length <= 1) formatted = cleaned;
			else if (cleaned.length <= 5)
				formatted = `${cleaned[0]} ${cleaned.slice(1)}`;
			else
				formatted = `${cleaned[0]} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`;
			break;
		}
		case Countries.Peru: {
			// Progressive: XXX → XXX XXX → XXX XXX XXX
			if (cleaned.length <= 3) formatted = cleaned;
			else if (cleaned.length <= 6)
				formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
			else
				formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`;
			break;
		}
		case Countries.Colombia: {
			// Progressive: 3XX → 3XX XXX → 3XX XXX XXXX
			if (cleaned.length <= 3) formatted = cleaned;
			else if (cleaned.length <= 6)
				formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
			else
				formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
			break;
		}
		default: {
			if (cleaned.length <= 1) formatted = cleaned;
			else if (cleaned.length <= 5)
				formatted = `${cleaned[0]} ${cleaned.slice(1)}`;
			else
				formatted = `${cleaned[0]} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`;
			break;
		}
	}

	if (includePrefix && resolvedCountry) {
		const config = phoneConfigs[resolvedCountry as CountryEnum];
		if (config) return `${config.code} ${formatted}`;
	}

	return formatted;
}
