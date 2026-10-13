import { CountryEnum, CurrencyEnum } from "../types";

/**
 * Maps each country to its supported currencies.
 * Easy to extend: just add new countries or currencies here.
 */
export const countryCurrencyMap: Record<CountryEnum, CurrencyEnum[]> = {
	Chile: ["CLP", "USD", "PEN", "COP"],
	Peru: ["PEN", "USD", "CLP", "COP"],
	Colombia: ["COP", "USD", "CLP", "PEN"],
};

/**
 * Maps each currency to its flag code (for react-flagpack).
 */
export const currencyFlagMap: Record<CurrencyEnum, "CL" | "PE" | "US" | "CO"> =
	{
		CLP: "CL",
		PEN: "PE",
		USD: "US",
		COP: "CO",
	};

/**
 * Default currency for each country (auto-selected on country change).
 */
export const defaultCurrencyByCountry: Record<CountryEnum, CurrencyEnum> = {
	Chile: "CLP",
	Peru: "PEN",
	Colombia: "COP",
};

/**
 * Get all supported currencies for a given country.
 */
export function getCurrenciesForCountry(country: CountryEnum): CurrencyEnum[] {
	return countryCurrencyMap[country] || [];
}

/**
 * Get the default currency for a given country.
 */
export function getDefaultCurrencyForCountry(
	country: CountryEnum,
): CurrencyEnum {
	return defaultCurrencyByCountry[country];
}

/**
 * Get the flag code for a given currency.
 */
export function getFlagCodeForCurrency(
	currency: CurrencyEnum,
): "CL" | "PE" | "US" | "CO" {
	return currencyFlagMap[currency];
}

/**
 * Get formatted currency options for a given country (with flag codes).
 * Use this in forms to render the currency dropdown menu.
 */
export function getCurrencyOptions(country: CountryEnum): Array<{
	code: CurrencyEnum;
	flagCode: "CL" | "PE" | "US" | "CO";
}> {
	const currencies = getCurrenciesForCountry(country);
	return currencies.map((code) => ({
		code,
		flagCode: getFlagCodeForCurrency(code),
	}));
}
