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

export const updatePasswordSchema = z.object({
	currentPassword: z.string().min(8),
	newPassword: z.string().min(8),
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
export type UserProfileForm = Pick<
	User,
	"name" | "businessName" | "email" | "phone" | "address"
>;
export type UserUpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

/** Bsale Products */

export const categorySchema = z.object({
	href: z.string().url(),
	id: z.number(),
	name: z.string(),
	isEditable: z.number().optional(),
	state: z.number(),
	imagestionCategoryId: z.number().optional(),
	prestashopCategoryId: z.number().optional(),
	attributes: z.object({
		href: z.string().url(),
	}),
});

export const categoriesSchema = z.array(categorySchema);

export const searchSchema = z.object({
	search: z
		.string()
		.trim()
		.min(1, { message: "El campo de busqueda no puede ir vacío" }),
});

export const bsaleResponseSchema = z.object({
	href: z.string().url(),
	count: z.number(),
	limit: z.number(),
	offset: z.number(),
	items: z.array(categorySchema),
});

export const productTypeSchema = z.object({
	href: z.string(),
	id: z.string(),
});

// Updated product schema to allow null for description
export const productSchema = z.object({
	href: z.string(),
	id: z.number(),
	name: z.string(),
	description: z.string().nullable().optional(), // Allowing `null` values for description
	classification: z.number(),
	ledgerAccount: z.string().nullable().optional(),
	costCenter: z.string().nullable().optional(),
	allowDecimal: z.number(),
	stockControl: z.number(),
	printDetailPack: z.number(),
	state: z.number(),
	prestashopProductId: z.number(),
	presashopAttributeId: z.number(),
	product_type: productTypeSchema,
	variants: z
		.object({
			href: z.string(),
		})
		.optional(),
	product_taxes: z
		.object({
			href: z.string(),
		})
		.optional(),
});

// Updated response schema
export const productsResponseSchema = z.object({
	href: z.string(),
	count: z.number(),
	limit: z.number(),
	offset: z.number(),
	items: z.array(productSchema),
	next: z.string().optional(),
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

//! Web Descriptions

// Esquema para productType
export const productWebTypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	isEditable: z.number(),
	state: z.number(),
	href: z.string().url(),
});

// Esquema para productTaxes (convertido a array para manejar el error más común)
export const productTaxesSchema = z.object({
	href: z.string().url(),
});

// Update baseInfo schema to match the actual structure
export const baseInfoSchema = z.object({
	id: z.number(),
	prestashopProductId: z.number(),
	prestashopAttributeId: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	classification: z.number(),
	basePrice: z.number(),
	state: z.number(),
	ledgerAccount: z.string().nullable(),
	costCenter: z.string().nullable(),
	allowDecimal: z.number(),
	stockControl: z.number(),
	printDetailPack: z.number(),
	href: z.string().url(),
});

// Esquema para pictures (array de imágenes)
export const pictureSchema = z.array(
	z.object({
		id: z.number(),
		href: z.string().url(),
		state: z.number(),
		legendImage: z.string().nullable(),
	})
);

// Esquema para variant - Corregido con campos requeridos
// Update variantWebSchema to include missing fields and make optional fields
export const variantWebSchema = z.object({
	id: z.number(),
	productId: z.number(),
	description: z.string().nullable().optional(),
	unlimitedStock: z.number().optional(),
	allowNegativeStock: z.number().optional(),
	showInEcommerce: z.number().optional(),
	state: z.number().optional(),
	barCode: z.string().nullable().optional(),
	code: z.string(),
	salePrices: z
		.object({
			price: z.string().nullable(),
			finalPrice: z.string().nullable(),
			taxPrice: z.string().nullable(),
			netDiscountPrice: z.string().nullable(),
		})
		.optional(),
	discounts: z.array(z.unknown()).optional(),
	stockInfo: z
		.array(
			z.object({
				productId: z.number(),
				variantId: z.number(),
				code: z.string(),
				quantity: z.number(),
				quantityReserved: z.number(),
				quantityAvailable: z.number(),
				office: z
					.object({
						id: z.number(),
						href: z.string().url(),
					})
					.optional(),
			})
		)
		.optional(),
	href: z.string().url().optional(),
	integration: z.record(z.string()).optional().nullable(),
	variantMarket: z.record(z.unknown()).optional(),
	attributeValues: z.array(z.unknown()).optional(),
	prices: z.array(z.unknown()).optional(),
	shipping: z
		.object({
			href: z.string().url(),
		})
		.optional(),
});

// Esquema para productWebDescription
export const productWebDescriptionSchema = z.object({
	id: z.number(),
	productId: z.number(),
	idVariantDefault: z.number(),
	urlSlug: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	descriptions: z.array(z.any()).nullable(),
	displayNotice: z.string(),
	state: z.number(),
	mkProductType: z.string(),
	productType: productWebTypeSchema,
	productTaxes: z.object({ href: z.string().url() }),
	urlImg: z.string().url(),
	pictures: pictureSchema,
	urlVideo: z.string().nullable(),
	shippingUnit: z.number(),
	width: z.number(),
	depth: z.number(),
	length: z.number(),
	baseInfo: baseInfoSchema,
	variants: z.array(variantWebSchema),
	relatedVariants: z.object({ href: z.string().url() }),
	collections: z.object({ href: z.string().url() }),
	brand: z.any().nullable(),
	variantShipping: z.object({ href: z.string().url() }),
	discounts: z.any().nullable(),
	stocks: z.object({ href: z.string().url() }),
	integration: z.record(z.string()).optional().nullable(),
	variant: z
		.object({
			id: z.number(),
			code: z.string(),
		})
		.optional(),
	order: z.number(),
	link: z.string(),
});

// Esquema para la respuesta de la API
export const productWebDescriptionResponseSchema = z.object({
	code: z.string().or(z.number()).optional(),
	href: z.string().url().optional(),
	count: z.number().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	data: z.array(productWebDescriptionSchema),
});

export type ProductWebDescription = z.infer<typeof productWebDescriptionResponseSchema>;
export type ProductWebType = z.infer<typeof productWebDescriptionSchema>;

export type Category = z.infer<typeof categorySchema>;
export type Categories = z.infer<typeof categoriesSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type BsaleResponse = z.infer<typeof bsaleResponseSchema>;

export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export type PriceLists = z.infer<typeof priceListItemSchema>;
export type PriceListsResponse = z.infer<typeof priceListsResponseSchema>;

export type Variants = z.infer<typeof variantSchema>;
export type VariantsResponse = z.infer<typeof variantsResponseSchema>;
