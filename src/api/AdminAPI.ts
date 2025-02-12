import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {usersResponseSchema, UserStatusForm } from "../types";

export async function getConfirmedUsers({ page, perPage }: { page: number, perPage: number }) {
    try {
        const url = `/auth/admin/users?page=${page}&perPage=${perPage}`;
        const { data } = await api.get(url);

        const response = usersResponseSchema.safeParse(data);
        if (response.success) {
            console.log("✅ Respuesta exitosa de la API:", response.data);
            return response.data;
        }

        console.error("Schema Validation failed:", response.error);
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);

        if (isAxiosError(error)) {
            console.error("🔍 Error de Axios detectado:");
            console.error("➡️ Código de estado:", error.response?.status);
            console.error("➡️ Mensaje de error:", error.response?.data?.error || error.message);
            console.error("➡️ Respuesta completa:", error.response?.data);
            throw new Error(error.response?.data?.message || "Ocurrió un error en la API");
        } else {
            console.error("⚠️ Error desconocido:", error);
            throw new Error("Error inesperado. Intenta nuevamente.");
        }
    }
}

export async function getUnconfirmedUsers({ page, perPage }: { page: number, perPage: number }) {
    try {
        const url = `/auth/admin/unconfirmed-users?page=${page}&perPage=${perPage}`;
        const { data } = await api.get(url);

        const response = usersResponseSchema.safeParse(data);
        if (response.success) {
            console.log("✅ Respuesta exitosa de la API:", response.data);
            return response.data;
        }

        console.error("Schema Validation failed:", response.error);
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);

        if (isAxiosError(error)) {
            console.error("🔍 Error de Axios detectado:");
            console.error("➡️ Código de estado:", error.response?.status);
            console.error("➡️ Mensaje de error:", error.response?.data?.error || error.message);
            console.error("➡️ Respuesta completa:", error.response?.data);
            throw new Error(error.response?.data?.message || "Ocurrió un error en la API");
        } else {
            console.error("⚠️ Error desconocido:", error);
            throw new Error("Error inesperado. Intenta nuevamente.");
        }
    }
}

export async function getUserById() {
    try {
        
    } catch (error) {
        
    }
}

// Get the current auth user
export async function getUser() {
    try {
        const url = `/auth/user`;
        const response = await api.get(url);
        //console.log(response.data)

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

// Manages the status of a user | Ban or Unban
export async function updateUserStatus({ userId } : UserStatusForm) {
    try {
        const url = `/auth/admin/update-status/${userId}`;
        const response = await api.patch(url);
    
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