import api from "@/lib/bsale";
import { isAxiosError } from "axios";
import { priceListsResponseSchema, productSchema, productWebDescriptionResponseSchema, productWebDescriptionSchema } from "../types";

export async function getProductById({ productId } : { productId: number }) {
    try {
        const url = `/v1/products/${productId}.json`;
        const { data } = await api.get(url);

        const response = productSchema.safeParse(data);
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

export async function getPriceLists() {
    try {
        const url = `/v1/price_lists.json`
        const { data } = await api.get(url);

        const response = priceListsResponseSchema.safeParse(data);
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

// Conseguir Descripción Web del Producto
export async function getAllProductDescription({limit, offset} : {limit: number, offset: number}) {
    try {
        const url = `/v2/products/list/market_info.json?limit=${limit}&offset=${offset}&expand=[descriptions, variantsInfo, variant.salePrice, variant.stock, productType, images, baseInfo, variant.discount, brand]&priceListId=1`;
        const { data } = await api.get(url);
        //console.log(data)
        
        const response = productWebDescriptionResponseSchema.safeParse(data);
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