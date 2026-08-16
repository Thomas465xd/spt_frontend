import {
	getOrdersResponseSchema,
	Order,
	OrderForm,
	orderSchema,
	OrderStatusForm,
	updateOrderResponseSchema,
} from "../types";
import { api, requestErrorHandler } from "@/lib/axios";

export async function getOrdersAdmin({
	page,
	perPage,
	status,
	businessId,
	country,
}: {
	page: number;
	perPage: number;
	status: string;
	businessId: string;
	country: string;
}) {
	try {
		// Base url
		let url = `/orders?page=${page}&perPage=${perPage}`;

		// Conditionally add filters to search url if they exists and are not empty
		if (country) {
			url += `&country=${encodeURIComponent(country)}`;
		}

		if (status) {
			url += `&status=${encodeURIComponent(status)}`;
		}

		if (businessId) {
			url += `&businessId=${encodeURIComponent(businessId)}`;
		}

		const { data } = await api.get(url);

		const response = getOrdersResponseSchema.safeParse(data);
		if (!response.success) {
			console.error("❌ Zod validation failed:", response.error);
			throw new Error("Invalid API response format");
		}

		return response.success ? response.data : null;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function getOrderByIdAdmin(orderId: string) {
	if (!orderId) return null; // Prevent undefined

	try {
		const { data } = await api.get(`/orders/${orderId}`);

		const result = orderSchema.safeParse(data);
		if (!result.success) {
			console.error("❌ Zod validation error:", result.error);
			return null; // <-- ALWAYS return something
		}

		return result.data; // Parsed & valid
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function getOrdersUser({
	page,
	perPage,
	status,
	country,
	orderId,
}: {
	page: number;
	perPage: number;
	status: string;
	country: string;
	orderId: string;
}) {
	try {
		// Base url
		let url = `/orders/user?page=${page}&perPage=${perPage}`;

		// Conditionally add filters to search url if they exists and are not empty
		if (country) {
			url += `&country=${encodeURIComponent(country)}`;
		}

		if (status) {
			url += `&status=${encodeURIComponent(status)}`;
		}

		if (orderId) {
			url += `&orderId=${encodeURIComponent(orderId)}`;
		}

		const { data } = await api.get(url);

		const response = getOrdersResponseSchema.safeParse(data);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function getOrderByIdUser(orderId: Order["id"]) {
	try {
		const url = `/orders/user/${orderId}`;
		const { data } = await api.get(url);

		const response = orderSchema.safeParse(data);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function createOrder(formData: OrderForm) {
	try {
		const url = `/orders`;
		const { data } = await api.post(url, formData);

		const response = orderSchema.safeParse(data);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function updateOrder({
	orderId,
	formData,
}: {
	orderId: string;
	formData: OrderForm;
}) {
	try {
		const url = `/orders/${orderId}`;
		const { data } = await api.patch(url, formData);

		const response = updateOrderResponseSchema.safeParse(data);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function updateOrderStatus({
	orderId,
	formData,
}: {
	orderId: string;
	formData: OrderStatusForm;
}) {
	try {
		const url = `/orders/status/${orderId}`;
		const { data } = await api.patch(url, formData);

		const response = updateOrderResponseSchema.safeParse(data);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function deleteOrder(orderId: string) {
	try {
		const url = `/orders/${orderId}`;
		const response = await api.delete(url);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}
