import { useEffect, useState } from "react";

export const useCountry = () => {
	const [country, setCountry] = useState<string | null>(null);
	const [countryCode, setCountryCode] = useState<string | null>(null);

	// Since useAuth() sets
	useEffect(() => {
		const storedCountry = localStorage.getItem("country");
		if (storedCountry) {
			setCountry(String(storedCountry));

			switch (storedCountry) {
				case "Chile":
					setCountryCode("CL");
					break;
				case "Peru":
					setCountryCode("PE");
					break;
				case "Columbia":
					setCountryCode("CO");
					break;
			}
		}
	}, []);

	return { country, countryCode };
};
