import api from "@/lib/bsale";
import { isAxiosError } from "axios";
import { bsaleResponseSchema, categorySchema, productsResponseSchema } from "../types";

// Modificada para aceptar parámetros adicionales como 'name', 'state', 'fields'
export async function getAllCategories({ limit, offset, name }: { limit: number; offset: number; name?: string;}) {
    try {
        const url = `/v1/product_types.json?limit=${limit}&offset=${offset}&name=${name || ""}`
        const { data } = await api.get(url);

        const response = bsaleResponseSchema.safeParse(data);
        if (response.success) {
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


export async function getCategory({ categoryId } : { categoryId: number }) {
    try {
        const url = `/v1/product_types/${categoryId}.json`
        const { data } = await api.get(url);

        const response = categorySchema.safeParse(data);
        if(response.success) {
            //console.log("✅ Respuesta exitosa de la API:", response.data);
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

//! Get Products by Category ID - Pendiente
export async function getProductsByCategory({ categoryId } : { categoryId: number }) {
    try {
        const url = `/v1/product_types/${categoryId}/products.json`;
        const { data } = await api.get(url);
        //console.log(data)

        const response = productsResponseSchema.safeParse(data);
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
