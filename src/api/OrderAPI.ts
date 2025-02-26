import api from "@/lib/bsale";
import { isAxiosError } from "axios";
import { checkoutResponseSchema, DispatchOrderForm, User, WithdrawOrderForm } from "../types";

export async function getOrdersByEmail({ email, token } : {email: User["email"], token?: string}) {
    try {
        const url = `/v1/markets/checkout/list.json?clientEmail=${email}&expand=cartDetails&token=${token || ""}`;
        console.log(url)
        const { data } = await api.get(url);

        const response = checkoutResponseSchema.safeParse(data);
        if(response.success) {
            console.log("✅ Respuesta exitosa de la API:", response.data);
            return response.data;
        }

        console.error("Schema Validation Failed", response.error);
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

export async function createDispatchOrder(finalData: DispatchOrderForm) {
    try {
        console.log(finalData)
        const url = "/v1/markets/checkout.json";
        const response = await api.post(url, finalData);

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

export async function createWithdrawalOrder(finalData: WithdrawOrderForm) {
    try {
        const url = "/v1/markets/checkout.json";
        const response = await api.post(url, finalData);

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