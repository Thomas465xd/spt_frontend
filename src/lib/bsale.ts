import axios from "axios";
import { Countries } from "../types";

const country = localStorage.getItem("country");

const bsaleApi = axios.create({
	baseURL: import.meta.env.VITE_BSALE_API_URL, // Ensure this is correct
});

bsaleApi.interceptors.request.use((config) => {
	//^ Discriminate between peruvian and chilean tokens
	let bsaleToken = "";

	switch (country) {
		case Countries.Chile: {
			bsaleToken = import.meta.env.VITE_BSALE_CHILE_API_TOKEN;
			break;
		}

		// TODO: Bsale colombia is not yet implemented
		case Countries.Colombia: {
			bsaleToken = import.meta.env.VITE_BSALE_CHILE_API_TOKEN;
			break;
		}

		case Countries.Peru: {
			bsaleToken = import.meta.env.VITE_BSALE_PERU_API_TOKEN;
			break;
		}

		default: {
			bsaleToken = import.meta.env.VITE_BSALE_CHILE_API_TOKEN;
			break;
		}
	}

	if (bsaleToken) {
		// Use `access_token` instead of `Authorization`
		config.headers["access_token"] = bsaleToken;
	}

	config.headers["Content-Type"] = "application/json";

	return config;
});

export default bsaleApi;
