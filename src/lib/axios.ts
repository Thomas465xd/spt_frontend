import axios, { isAxiosError } from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
	const adminToken = localStorage.getItem("SPT_ADMIN_TOKEN");
	const userToken = localStorage.getItem("SPT_AUTH_TOKEN");

	// Prioriza el token de admin si existe, de lo contrario usa el de usuario normal
	const token = adminToken || userToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const requestErrorHandler = (error: Error) => {
	console.error("❌ Error en la solicitud:", error);

	if (isAxiosError(error)) {
		console.error("🔍 Error de Axios detectado:");
		console.error("➡️ Código de estado:", error.response?.status);
		console.error(
			"➡️ Mensaje de error:",
			error.response?.data?.error || error.message,
		);
		console.error("➡️ Respuesta completa:", error.response?.data);

		// Lanzamos un error más detallado para que pueda ser manejado correctamente
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.errors[0].message ||
				"Ocurrió un error en la API",
		);
	} else {
		console.error("⚠️ Error desconocido:", error);
		throw new Error(
			"Error inesperado. Intenta nuevamente. Si el error persiste, contacta al administrador.",
		);
	}
};
