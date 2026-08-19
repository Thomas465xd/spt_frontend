import { api, requestErrorHandler } from "@/lib/axios";
import {
	ConfigurePasswordForm,
	ForgotPasswwordForm,
	PasswordToken,
	UserLoginForm,
	UserRegistrationForm,
} from "../types";

export async function createAccount(formData: UserRegistrationForm) {
	console.log(
		"📌 Enviando solicitud a /auth/create-account con los datos:",
		formData,
	);

	try {
		const url = "/auth/create-account";
		const response = await api.post(url, formData);

		//console.log("✅ Respuesta exitosa de la API:", response.data);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function login(formData: UserLoginForm) {
	try {
		const url = "/auth/login";
		const response = await api.post(url, formData);

		if (response.data.admin) {
			localStorage.setItem("SPT_ADMIN_TOKEN", response.data.token);
			if (localStorage.getItem("SPT_AUTH_TOKEN")) {
				localStorage.removeItem("SPT_AUTH_TOKEN");
			}
		} else {
			localStorage.setItem("SPT_AUTH_TOKEN", response.data.token);
		}

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function forgotPasswordEmail(email: ForgotPasswwordForm) {
	try {
		const url = `/auth/forgot-password`;
		const response = await api.post(url, email);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function validatePasswordToken(token: string): Promise<boolean> {
	try {
		const url = `/auth/validate-token/${token}`;
		const response = await api.get(url);

		return response.data.success ?? false;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function setPassword({
	token,
	formData,
}: {
	formData: ConfigurePasswordForm;
	token: PasswordToken["token"];
}) {
	try {
		const url = `/auth/set-password/${token}`;
		const response = await api.post(url, formData);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}

export async function resetPassword({
	token,
	formData,
}: {
	formData: ConfigurePasswordForm;
	token: PasswordToken["token"];
}) {
	try {
		const url = `/auth/reset-password/${token}`;
		const response = await api.post(url, formData);

		return response.data;
	} catch (error) {
		return requestErrorHandler(error as Error);
	}
}
