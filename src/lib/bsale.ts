import axios from "axios";

const bsaleApi = axios.create({
    baseURL: import.meta.env.VITE_BSALE_API_URL, // Ensure this is correct
});

bsaleApi.interceptors.request.use((config) => {
    const bsaleToken = import.meta.env.VITE_BSALE_API_TOKEN;

    if (bsaleToken) {
        // Use `access_token` instead of `Authorization`
        config.headers["access_token"] = bsaleToken;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
});

export default bsaleApi;
