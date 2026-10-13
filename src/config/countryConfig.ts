import { Countries, CountryEnum } from "../types";

/**
 * Maps each country to its flag code (for react-flagpack).
 */
export const countryFlagMap: Record<Countries, "CL" | "PE" | "US" | "CO"> = {
	Chile: "CL",
	Peru: "PE",
	USA: "US",
	Colombia: "CO",
};

/**
 * Get the flag code for a given country
 */
export function getFlagCodeForCountry(
	country: CountryEnum,
): "CL" | "PE" | "US" | "CO" {
	return countryFlagMap[country];
}
