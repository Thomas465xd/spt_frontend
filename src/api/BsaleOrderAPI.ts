import api from "@/lib/bsale";
import { api as axiosApi } from "@/lib/axios";
import {
	adminCheckoutResponseSchema,
	CheckoutEmails,
	checkoutResponseSchema,
	DispatchOrderForm,
	emailSchema,
	User,
	WithdrawOrderForm,
} from "../types";
import { requestErrorHandler } from "@/lib/axios";

export async function getOrdersByEmail({
	email,
	token,
	limit,
	offset,
}: {
	email: User["email"];
	token?: string;
	limit: number;
	offset: number;
}) {
	try {
		const url = `/v1/markets/checkout/list.json?clientEmail=${email}&expand=cartDetails&token=${token || ""}&limit=${limit}&offset=${offset}`;

		const { data } = await api.get(url);

		// If no data or empty array, return a default structure
		if (!data || !data.data || data.data.length === 0) {
			return {
				data: [],
				count: 0,
			};
		}

		const response = checkoutResponseSchema.safeParse(data);
		if (response.success) {
			//console.log("✅ Respuesta exitosa de la API:", response.data);
			return response.data;
		}

		//console.error("Schema Validation Failed", response.error);

		// Return a fallback structure if schema validation fails
		return {
			data: [],
			count: 0,
		};
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function getAllOrders({
	email,
	clientName,
	token,
	limit,
	offset,
}: {
	email?: User["email"];
	clientName?: User["name"];
	token?: string;
	limit: number;
	offset: number;
}) {
	try {
		const url = `/v1/markets/checkout/list.json?clientEmail=${email || ""}&expand=cartDetails&token=${token || ""}&clientName=${clientName || ""}&limit=${limit}&offset=${offset}`;
		//console.log(url)
		const { data } = await api.get(url);
		//console.log(data)

		const response = adminCheckoutResponseSchema.safeParse(data);
		//console.log(response)
		if (response.success) {
			//console.log("✅ Respuesta exitosa de la API:", response.data);
			return response.data;
		}

		console.error("Schema Validation Failed", response.error);
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function createDispatchOrder(finalData: DispatchOrderForm) {
	try {
		console.log(finalData);
		const url = "/v1/markets/checkout.json";
		const response = await api.post(url, finalData);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function createWithdrawalOrder(finalData: WithdrawOrderForm) {
	try {
		const url = "/v1/markets/checkout.json";
		const response = await api.post(url, finalData);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function sendOrderEmails(emailData: CheckoutEmails) {
	try {
		const url = "/order/send";
		const { data } = await axiosApi.post(url, emailData);

		const response = emailSchema.safeParse(data);
		if (response.success) {
			//console.log("✅ Respuesta exitosa de la API:", response.data);
			return response.data;
		}

		console.error("Schema Validation Failed", response.error);
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function changeOrderStatus({
	orderId,
	active,
}: {
	orderId: number;
	active: number;
}) {
	try {
		console.log(orderId, active);
		const url = `/v1/checkout/${orderId}.json`;
		const response = await api.put(url, { active: active });
		console.log(response);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}
