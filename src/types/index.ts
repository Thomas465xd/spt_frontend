import { z } from "zod";

/** Auth & Admin */

export const userSchema = z.object({
	_id: z.string(),
	name: z.string(),
	businessName: z.string(),
	rut: z.string(),
	businessRut: z.string(),
	email: z.string().email(),
	phone: z.string(),
	address: z.string(),
	confirmed: z.boolean(),
	passwordSet: z.boolean(),
	admin: z.boolean(),
	password: z.string().min(8),
});

export const adminTableUserSchema = z.object({
	_id: z.string(),
	name: z.string(),
	businessName: z.string(),
	rut: z.string(),
	businessRut: z.string(),
	email: z.string().email(),
	phone: z.string(),
	address: z.string(),
	confirmed: z.boolean(),
	passwordSet: z.boolean(),
	admin: z.boolean(),
	password: z.string().optional(),
});

// Define el esquema para la respuesta de la API
export const usersResponseSchema = z.object({
	users: z.array(adminTableUserSchema), // Se espera un arreglo dentro de la propiedad 'users'
	totalUsers: z.number(),
	totalPages: z.number(),
});

export const userResponseSchema = z.object({
	user: adminTableUserSchema,
	token: z.string().optional(),
});

export const registerSchema = userSchema.pick({
	name: true,
	businessName: true,
	rut: true,
	businessRut: true,
	email: true,
	phone: true,
	address: true,
});

export const loginSchema = userSchema.pick({
	rut: true,
	email: true,
	password: true,
});

export const forgotPasswordSchema = userSchema.pick({
	email: true,
});

export const tokenSchema = z.object({
	token: z.string(),
	type: z.enum(["admin_confirmation", "password_reset"]),
	userId: z.string(),
});

export const setPasswordSchema = z.object({
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
});

export const userStatusSchema = z.object({
	userId: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type UsersCompleteResponse = z.infer<typeof usersResponseSchema>;
export type UsersResponse = Pick<UsersCompleteResponse, "users">;
export type UserRegistrationForm = z.infer<typeof registerSchema>;
export type UserLoginForm = z.infer<typeof loginSchema>;
export type ForgotPasswwordForm = z.infer<typeof forgotPasswordSchema>;
export type UserStatusForm = z.infer<typeof userStatusSchema>;
export type ConfigurePasswordForm = z.infer<typeof setPasswordSchema>;
export type Token = z.infer<typeof tokenSchema>;
export type PasswordToken = Pick<Token, "token">;

/** Bsale Products */

export const productSchema = z.object({
	href: z.string().url(),
	id: z.number(),
	name: z.string(),
	isEditable: z.number(),
	state: z.number(),
	imagestionCategoryId: z.number(),
	prestashopCategoryId: z.number(),
	attributes: z.object({
		href: z.string().url(),
	}),
});

export const bsaleResponseSchema = z.object({
	href: z.string().url(),
	count: z.number(),
	limit: z.number(),
	offset: z.number(),
	items: z.array(productSchema),
});

export const coinSchema = z.object({
	href: z.string().url(),
	id: z.string(),
});

export const detailsSchema = z.object({
	href: z.string().url(),
});

export const priceListItemSchema = z.object({
	href: z.string().url(),
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	state: z.number().int().min(0).max(1),
	coin: coinSchema,
	details: detailsSchema,
});

export const priceListsResponseSchema = z.object({
	href: z.string().url(),
	count: z.number().int(),
	limit: z.number().int().max(50),
	offset: z.number().int(),
	items: z.array(priceListItemSchema),
});

export const variantProductSchema = z.object({
	href: z.string().url(),
	id: z.string(),
});

export const variantSchema = z.object({
	href: z.string().url(),
	id: z.number(),
	description: z.string(),
	unlimitedStock: z.boolean(),
	allowNegativeStock: z.boolean(),
	state: z.boolean(),
	barCode: z.string(),
	code: z.string(),
	imagestionCenterCost: z.number(),
	imagestionAccount: z.number(),
	imagestionConceptCod: z.number(),
	imagestionProyectCod: z.number(),
	imagestionCategoryCod: z.number(),
	imagestionProductId: z.number(),
	serialNumber: z.number(),
	prestashopCombinationId: z.number(),
	prestashopValueId: z.number(),
	product: variantProductSchema,
	attribute_values: z.object({
		href: z.string().url(),
	}),
	costs: z.object({
		href: z.string().url(),
	}),
});

export const variantsResponseSchema = z.object({
	href: z.string().url(),
	count: z.number(),
	limit: z.number(),
	offset: z.number(),
	items: z.array(variantSchema),
	next: z.string().url().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type BsaleResponse = z.infer<typeof bsaleResponseSchema>;

export type PriceLists = z.infer<typeof priceListItemSchema>;
export type PriceListsResponse = z.infer<typeof priceListsResponseSchema>;

export type Variants = z.infer<typeof variantSchema>;
export type VariantsResponse = z.infer<typeof variantsResponseSchema>;
