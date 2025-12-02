import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { getOrdersResponseSchema, Order, OrderForm, orderSchema, OrderStatusForm, updateOrderResponseSchema } from "../types";

//TODO: Work on API Calls to the /orders endpoints

export async function getOrdersAdmin({ page, perPage, status, businessRut, country } : { page: number, perPage: number, status: string, businessRut: string, country: string }) {
    try {
        // Base url
        let url = `/orders?page=${page}&perPage=${perPage}`;

        // Conditionally add filters to search url if they exists and are not empty
        if(country) {
            url += `&code=${encodeURIComponent(country)}`
        }
        
        if(status) {
            url += `&status=${encodeURIComponent(status)}`
        }

        if(businessRut) {
            url += `&businessRut=${encodeURIComponent(businessRut)}`
        }

        const { data } = await api.get(url);

        const response = getOrdersResponseSchema.safeParse(data);

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

export async function getOrderByIdAdmin(orderId: Order["_id"]) {
    try {
        const url = `/orders/${orderId}`;
        const { data } = await api.get(url);

        const response = orderSchema.safeParse(data);

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
            throw new Error("Error inesperado. Intenta nuevamente. Si el error persiste, contacta al administrador.");
        }
    }
}

export async function getOrdersUser({ page, perPage, status, country } : { page: number, perPage: number, status: string, country: string }) {
    try {
        // Base url
        let url = `/orders/user?page=${page}&perPage=${perPage}`;

        // Conditionally add filters to search url if they exists and are not empty
        if(country) {
            url += `&code=${encodeURIComponent(country)}`
        }
        
        if(status) {
            url += `&status=${encodeURIComponent(status)}`
        }

        const { data } = await api.get(url);

        const response = getOrdersResponseSchema.safeParse(data);

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

export async function getOrderByIdUser(orderId: Order["_id"]) {
    try {
        const url = `/orders/user/${orderId}`;
        const { data } = await api.get(url);

        const response = orderSchema.safeParse(data);

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
            throw new Error("Error inesperado. Intenta nuevamente. Si el error persiste, contacta al administrador.");
        }
    }
}

export async function createOrder(formData: OrderForm) {
    try {
        const url = `/orders`;
        const { data } = await api.post(url, formData);

        const response = orderSchema.safeParse(data);

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
            throw new Error("Error inesperado. Intenta nuevamente. Si el error persiste, contacta al administrador.");
        }
    }
}

export async function updateOrderStatus({ orderId, formData } : {orderId: string, formData: OrderStatusForm }) {
    try {
        const url = `/orders/status/${orderId}`;
        const { data } = await api.patch(url, formData);

        const response = updateOrderResponseSchema.safeParse(data);

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
            throw new Error("Error inesperado. Intenta nuevamente. Si el error persiste, contacta al administrador.");
        }
    }
}

export async function deleteOrder(orderId: string) {
    try {
        const url = `/orders/${orderId}`;
        const response = await api.delete(url);

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
            throw new Error("Error inesperado. Intenta nuevamente. Si el error persiste, contacta al administrador.");
        }
    }
}