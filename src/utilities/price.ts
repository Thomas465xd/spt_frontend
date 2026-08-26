import { Countries, CurrencyEnum } from "../types";

const country = localStorage.getItem("country");

export function formatCurrency(value: number, currency?: CurrencyEnum) {
	if (!currency) {
		switch (country) {
			case Countries.Chile:
				return `$ ${Math.round(value).toLocaleString("es-CL")}`;
			case Countries.Peru:
				return `S/ ${Math.round(value).toLocaleString("es-PE")}`;
			// TODO: Bsale colombia is not yet implemented
			case Countries.Colombia:
				return `$ ${Math.round(value).toLocaleString("es-CL")}`;
			default:
				return `$ ${Math.round(value).toLocaleString("es-CL")}`;
		}
	}

	switch (currency) {
		case "CLP":
			return `$ ${Math.round(value).toLocaleString("es-CL")}`;
		case "PEN":
			return `S/ ${Math.round(value).toLocaleString("es-PE")}`;
	}
}
