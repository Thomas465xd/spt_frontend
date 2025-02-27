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

export const authUserSchema = z.object({
    _id: z.string(),
    name: z.string(),
    businessName: z.string(),
    rut: z.string(),
    businessRut: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    admin: z.boolean(),
})

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
export type AuthUser = z.infer<typeof authUserSchema>;
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
        .default({
            price: null,
            finalPrice: null,
            taxPrice: null,
            netDiscountPrice: null,
        }),
	discounts: z.preprocess((val) => (val === null ? [] : val), // Convert null to []
        z.array(z.number()).optional().default([])
    ),

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
	urlImg: z.string(),
    //urlImg: z.string().url(),
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
	discounts: z.preprocess((val) => (val === null ? [] : val), // Convert null to []
        z.array(z.number()).optional().default([])
    ),

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

//? Cart Schemas
export const detailCartDataSchema = z.object({
    id: z.number(), 
    quantity: z.number(),
    unitValue: z.number(),
    netUnitValue: z.number(), 
    discount: z.number().optional(),
    itemName: z.string(),
    total: z.number(),
    image: z.string(),
    idVarianteProducto: z.number(),
    sku: z.string(),
    link: z.string(),
    productWebId: z.number(),
    cartId: z.number(),
    taxList: z.array(z.number()),
    shipping: z.object({
        id: z.number(),
        weight: z.number(),
        height: z.number(),
        width: z.number(),
        deph: z.number(), 
        length: z.number(), 
        match: z.number()
    }).optional(),
    value: z.number(),
    cd_q: z.number(),
    cd_unit_value: z.number(),
    cd_discount: z.number(),
    cd_sub_total: z.number(),
    cd_id: z.number(), 
    cd_id_discount: z.number(),
    cd_image: z.string(),
    id_variante_producto: z.number(),
    codigo_variante_producto: z.string(), 
    href: z.string().url(),
})

export const detailCartSchema = z.object({
    code: z.string(),
    href: z.string().url(),
    count: z.number(),
    limit: z.number(),
    offset: z.number(),
    data: z.array(detailCartDataSchema).default([]),
    previous: z.string().url().optional(),
})

export const cartSchema = z.object({
    cartDetails: z.array(z.object({
        quantity: z.number(),
        unitValue: z.number(),
        image: z.string().url(),
        idVarianteProducto: z.number(),
        itemName: z.string(),
        productWebId: z.number(), 
        discount: z.number().optional(), 
    }))
})

//* Checkout Schemas TO DO */
export const extrasUserDataSchema = z.object({
    user_rut: z.string(), 
    razon_social: z.string(), 
    direccion: z.string().optional(), 
    ciudad: z.string().optional(), 
    comuna: z.string().optional(),
})

export const userCheckoutSchema = z.object({
    generateDocument: z.number(), 
    documentData: z.object({
        emissionDate: z.string(), 
    }),
    clientName: z.string(), 
    clientLastName: z.string(), 
    clientEmail: z.string(), 
    clientPhone: z.string(), 
    pickName: z.string(),
    pickCode: z.string(),
    pickStoreId: z.number().default(1),
    code: z.string(), 
    ptId: z.number(), 
    payProcess: z.string(), 
    clientCountry: z.string(), 
    clientState: z.string(),
    clientCityZone: z.string(), 
    clientStreet: z.string(), 
    clientPostcode: z.string(), 
    clientBuildingNumber: z.string(), 
    cartDetails: z.array(detailCartDataSchema),
    extrasUserData: extrasUserDataSchema.optional(),
    isDispatch: z.boolean(),
})

export const dispatchCheckoutSchema = z.object({
    generateDocument: z.number(), 
    clientName: z.string(), 
    clientLastName: z.string(), 
    clientEmail: z.string(), 
    clientPhone: z.string(), 
    code: z.string(), 
    ptId: z.number(), 
    payProcess: z.string(), 
    clientCountry: z.string(), 
    clientState: z.string(),
    clientCityZone: z.string(), 
    clientStreet: z.string(), 
    clientPostcode: z.string(), 
    clientBuildingNumber: z.string(), 
    marketId: z.number(), 
    withdrawStore: z.number(), 
    shippingCost: z.number(),
    extrasUserData: extrasUserDataSchema.optional(),
    cartDetails: z.array(detailCartDataSchema),
    documentData: z.object({
        emissionDate: z.string(), 
    }),
})

export const withdrawCheckoutSchema = z.object({
    generateDocument: z.number(), 
    clientName: z.string(), 
    clientLastName: z.string(), 
    clientEmail: z.string(), 
    clientPhone: z.string(), 
    pickName: z.string(),
    pickCode: z.string(),
    code: z.string(), 
    ptId: z.number(), 
    payProcess: z.string(), 
    clientCountry: z.string(), 
    clientState: z.string(),
    clientCityZone: z.string(), 
    clientStreet: z.string(), 
    clientPostcode: z.string(), 
    clientBuildingNumber: z.string(), 
    pickStoreId: z.number(), 
    marketId: z.number(), 
    withdrawStore: z.number(), 
    shippingCost: z.number(),
    extrasUserData: extrasUserDataSchema.optional(),
    cartDetails: z.array(detailCartDataSchema),
    documentData: z.object({
        emissionDate: z.string(), 
    }),
})

export const checkoutSchema = z.object({
    id: z.number(),
    token: z.string(),
    clientName: z.string(),
    clientEmail: z.string().email(),
    clientPhone: z.string(),
    clientCountry: z.string(),
    clientState: z.string(),
    clientCityZone: z.string(),
    clientStreet: z.string(),
    clientPostcode: z.string(),
    clientBuildingNumber: z.string(),
    cartId: z.number(),
    cartDetails: z.array(detailCartDataSchema),
    extrasUserData: extrasUserDataSchema.optional(),
    ptId: z.number(),
    createAt: z.number().optional(),
    shippingCost: z.number(),
    isMafs: z.number(),
    discountCost: z.number(),
    active: z.number(),
    totalCart: z.number(),
    pickStoreId: z.number(),
    pickName: z.string(),
    pickCode: z.string(), 
    id_venta_documento_tributario: z.number().optional(),
    documentNumber: z.number().optional(),
    documentToken: z.string(), 
    marketId: z.number(), 
    isService: z.number(),
    withdrawStore: z.number(),
    payProcess: z.string(), 
    nameTypeDocument: z.string(), 
    total: z.number(), 
    url: z.string().url(),
    currency: z.object({
        decimals: z.number(), 
        symbol: z.string(), 
        decimalSeparator: z.string(), 
    })
}) 

export const checkoutResponseSchema = z.object({
    code: z.number(), 
    href: z.string().url(),
    count: z.number(), 
    limit: z.number(), 
    offset: z.number(), 
    data: z.array(checkoutSchema).default([]),
})

//! Email
export const emailSchema = checkoutSchema.pick({
    token: true,
    clientName: true,
    clientEmail: true,
    clientPhone: true,
    clientCountry: true,
    clientState: true,
    clientCityZone: true,
    clientStreet: true,
    clientPostcode: true,
    clientBuildingNumber: true,
    shippingCost: true,
    discountCost: true,
    total: true,
    pickCode: true,
    cartDetails: true,
})

// Product Types 
export type ProductWebDescription = z.infer<typeof productWebDescriptionResponseSchema>;
export type ProductWebType = z.infer<typeof productWebDescriptionSchema>;

// Shopping Cart Types
export type CartForm = z.infer<typeof cartSchema>;
export type CartDetail = z.infer<typeof detailCartSchema>;
export type CartDetailModal = Pick<CartDetail, "data">;
export type CartDetailData = z.infer<typeof detailCartDataSchema>;

// Checkout/Orders Types
export type DispatchOrderForm = z.infer<typeof dispatchCheckoutSchema>;
export type WithdrawOrderForm = z.infer<typeof withdrawCheckoutSchema>;

export type UserCheckoutForm = z.infer<typeof userCheckoutSchema>;

export type CheckoutForm = z.infer<typeof checkoutSchema>;
export type CheckoutEmails = z.infer<typeof emailSchema>;

export type Category = z.infer<typeof categorySchema>;
export type Categories = z.infer<typeof categoriesSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type BsaleResponse = z.infer<typeof bsaleResponseSchema>;

export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export type PriceLists = z.infer<typeof priceListItemSchema>;
export type PriceListsResponse = z.infer<typeof priceListsResponseSchema>;