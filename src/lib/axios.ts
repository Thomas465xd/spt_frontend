import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use( config => {
    const adminToken = localStorage.getItem("SPT_ADMIN_TOKEN");
    const userToken = localStorage.getItem("SPT_AUTH_TOKEN");

    // Prioriza el token de admin si existe, de lo contrario usa el de usuario normal
    const token = adminToken || userToken;

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})

export default api