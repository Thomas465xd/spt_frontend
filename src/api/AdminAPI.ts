import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {authUserSchema, Token, UserDiscountForm, UserDiscountSearch, userResponseSchema, usersResponseSchema, UserStatusForm } from "../types";

export async function getConfirmedUsers({ page, perPage, searchRUT, searchEmail }: { page: number, perPage: number, searchRUT?: string, searchEmail?: string }) {
    try {
        const url = `/auth/admin/users?page=${page}&perPage=${perPage}&searchRUT=${searchRUT || ""}&searchEmail=${searchEmail || ""}`;
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

export async function getUnconfirmedUsers({ page, perPage, searchRUT, searchEmail }: { page: number, perPage: number, searchRUT?: string, searchEmail?: string }) {
    try {
        const url = `/auth/admin/unconfirmed-users?page=${page}&perPage=${perPage}&searchRUT=${searchRUT || ""}&searchEmail=${searchEmail || ""}`;
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

// Get an user by its ObjectId
export async function getUserById({ userId } : UserStatusForm) {
    try {
        const url = `/auth/admin/user/${userId}`;
        const { data } = await api.get(url);

        const response = userResponseSchema.safeParse(data);
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

//TODO Get user by RUT
export async function getUserByRut({ rut } : UserDiscountSearch) {
    try {
        const url = `/auth/admin/user/rut/${rut}`;
        const { data } = await api.get(url);
        console.log(data)

        const response = authUserSchema.safeParse(data);
        if (response.success) {
            console.log("✅ Respuesta exitosa de la API:", response.data);
            return response.data; // ✅ Valid return
        }

        console.warn("⚠️ Error al validar esquema con Zod:", response.error.format());
        throw new Error("Respuesta de la API inválida");
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

// Get the current auth user
export async function getUser() {
    try {
        const url = `/auth/user`;
        const { data } = await api.get(url);

        const response = authUserSchema.safeParse(data);

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

//TODO Set the user custom discount attribute to a number from 1 to 100
export async function setUserDiscount({ userId, discount } : UserDiscountForm) {
    try {
        const url = `/auth/admin/user/${userId}/discount`;
        const response = await api.patch(url, { discount });
    
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

// Confirm a user and delete the confirmation token
export async function confirmUser(token : Token['token']) {
    try {
        const url = `/auth/admin/confirm/${token}`;
        const response = await api.post(url);
    
        return response.data;
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);

        if (isAxiosError(error)) {
            console.error("🔍 Error de Axios detectado:");
            console.error("➡️ Código de estado:", error.response?.status);
            console.error("➡️ Mensaje de error:", error.response?.data?.error || error.message);
            console.error("➡️ Respuesta completa:", error.response?.data);

            // Lanzamos un error más detallado para que pueda ser manejado correctamente
            throw new Error(error.response?.data?.message || "El Token no Existe");
        } else {
            console.error("⚠️ Error desconocido:", error);
            throw new Error("Error inesperado. Intenta nuevamente.");
        }
    }
}

// Delete a user who does not have a password setted
export async function deleteUser(userId : UserStatusForm['userId']) {
    try {
        const url = `/auth/admin/delete-user/${userId}`;
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
            throw new Error(error.response?.data?.message || "El Token no Existe");
        } else {
            console.error("⚠️ Error desconocido:", error);
            throw new Error("Error inesperado. Intenta nuevamente.");
        }
    }
}