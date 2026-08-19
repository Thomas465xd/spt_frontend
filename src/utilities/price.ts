import { CurrencyEnum } from "../types";

export function formatCurrency(value: number, currency: CurrencyEnum) {
	switch (currency) {
		case "CLP":
			return `$ ${Math.round(value).toLocaleString("es-CL")}`;
		case "PEN":
			return `$ ${Math.round(value).toLocaleString("es-PE")}`;
	}
}
