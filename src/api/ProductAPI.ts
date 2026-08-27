import api from "@/lib/bsale";
import {
	CartForm,
	Countries,
	detailCartSchema,
	productWebDescriptionResponseSchema,
} from "../types";
import { requestErrorHandler } from "@/lib/axios";

// Conseguir Descripción Web del Producto
export async function getAllProductDescription({
	limit,
	offset,
	name,
	code,
}: {
	limit: number;
	offset: number;
	name?: string;
	code?: string;
}) {
	try {
		const country = localStorage.getItem("country");

		let priceListId = 0;

		switch (country) {
			case Countries.Chile:
			case Countries.Colombia: // TODO: Bsale colombia is not yet implemented
			default:
				priceListId = 1;
				break;

			case Countries.Peru:
				priceListId = 5;
				break;
		}

		// Base URL
		let url = `/v2/products/list/market_info.json?limit=${limit}&offset=${offset}&priceListId=${priceListId}&expand=[descriptions, variantsInfo, variant.salePrice, variant.stock, productType, images, baseInfo, variant.discount, brand]&productWebType=virtual`;

		// Conditionally add name if it exists
		if (name) {
			url += `&name=${encodeURIComponent(name)}`;
		}

		// Conditionally add code if it exists and is not empty
		if (code) {
			url += `&code=${encodeURIComponent(code)}`;
		}

		// console.log(url)
		const { data } = await api.get(url);
		// console.log(data);

		const response = productWebDescriptionResponseSchema.safeParse(data);
		if (response.success) {
			//console.log("✅ Respuesta exitosa de la API:", response.data);
			return response.data;
		}

		console.error("Schema Validation Failed", response.error);
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

//? Get Cart Detail by ID
export async function getCartDetailById(cartId: number) {
	try {
		const url = `/v1/cart/${cartId}/detail.json`;
		const { data } = await api.get(url);
		//console.log(data)

		const response = detailCartSchema.safeParse(data);
		if (response.success) {
			////console.log("✅ Respuesta exitosa de la API:", response.data);
			return response.data;
		}

		console.error("Schema Validation Failed", response.error);
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

//? Add to Cart
export async function addToCart(formData: CartForm) {
	try {
		const url = `/v1/cart/new.json`;
		const response = await api.post(url, formData);

		if (response.data.code === "200") {
			const cartId = response.data.data.id;
			localStorage.setItem("cartId", cartId.toString());
			return cartId;
		}

		console.error("❌ Error en la solicitud:", response.data);
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

//? Update Cart
export async function updateCart({
	formData,
	cartId,
}: {
	formData: CartForm;
	cartId: number;
}) {
	try {
		const url = `/v1/cart/${cartId}.json`;
		const response = await api.put(url, formData);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

//? Delete Cart
export async function deleteCart({
	cartId,
	detailId,
}: {
	cartId: number;
	detailId: number;
}) {
	try {
		const url = `/v1/cart/${cartId}/detail/${detailId}.json`;
		const response = await api.delete(url);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}
