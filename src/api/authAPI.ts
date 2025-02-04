import api from "@/lib/axios";
import { UserRegistrationForm } from "../types";
import { isAxiosError } from "axios";

export async function createAccount(formData: UserRegistrationForm) {
    console.log("📌 Enviando solicitud a /auth/create-account con los datos:", formData);

    try {
        const url = "/auth/create-account";
        const response = await api.post(url, formData);

        console.log("✅ Respuesta exitosa de la API:", response.data);

        return response.data;
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);

        if (isAxiosError(error)) {
            console.error("🔍 Error de Axios detectado:");
            console.error("➡️ Código de estado:", error.response?.status);
            console.error("➡️ Mensaje de error:", error.response?.data?.error || error.message);
            console.error("➡️ Respuesta completa:", error.response?.data);

            // Lanzamos un error más detallado para que pueda ser manejado correctamente
            throw new Error(error.response?.data?.message || "Ocurrió un error en la API");
        } else {
            console.error("⚠️ Error desconocido:", error);
            throw new Error("Error inesperado. Intenta nuevamente.");
        }
    }
}
