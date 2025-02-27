import api from "@/lib/bsale";
import { isAxiosError } from "axios";
import { CartForm, detailCartSchema, productWebDescriptionResponseSchema } from "../types";

// Conseguir Descripción Web del Producto
export async function getAllProductDescription({limit, offset, name, code} : {limit: number, offset: number, name?: string, code?: string}) {
    try {
        //const url = `/v2/products/list/market_info.json?limit=${limit}&offset=${offset}&expand=[descriptions, variantsInfo, variant.salePrice, variant.stock, productType, images, baseInfo, variant.discount, brand]&priceListId=1&name=${name}`;

        // Base URL
        let url = `/v2/products/list/market_info.json?limit=${limit}&offset=${offset}&expand=[descriptions, variantsInfo, variant.salePrice, variant.stock, productType, images, baseInfo, variant.discount, brand]&priceListId=1&productWebType=virtual`;

        // Conditionally add name if it exists
        if (name) {
            url += `&name=${encodeURIComponent(name)}`;
        }

        // Conditionally add code if it exists and is not empty
        if (code) {
            url += `&code=${encodeURIComponent(code)}`;
        }

        //console.log(url)
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

//? Get Cart Detail by ID
export async function getCartDetailById(cartId : number) {
    try {
        const url = `/v1/cart/${cartId}/detail.json`;
        const { data } = await api.get(url);
        //console.log(data)

        const response = detailCartSchema.safeParse(data);
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

//? Add to Cart 
export async function addToCart(formData : CartForm) {
    try {
        const url = `/v1/cart/new.json`;
        const response = await api.post(url, formData);

        if(response.data.code === "200") {
            const cartId = response.data.data.id;
            localStorage.setItem("cartId", cartId.toString());
            return cartId;
        }

        console.error("❌ Error en la solicitud:", response.data);
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

//? Update Cart
export async function updateCart({formData, cartId} : {formData: CartForm, cartId: number}) {
    try {
        const url = `/v1/cart/${cartId}.json`;
        const response = await api.put(url, formData);

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

//? Delete Cart
export async function deleteCart({ cartId, detailId }: { cartId: number; detailId: number }) {
    try {
        const url = `/v1/cart/${cartId}/detail/${detailId}.json`;
        const response = await api.delete(url);

        return response.data;
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
