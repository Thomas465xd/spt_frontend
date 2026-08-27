import { z } from "zod";
import { authUserSchema } from "./auth";

// Define el esquema para la respuesta de la API
export const usersResponseSchema = z.object({
	users: z.array(
		authUserSchema.extend({
			passwordSet: z.boolean(),
		}),
	),
	totalUsers: z.number(),
	totalPages: z.number(),
});

export const userResponseSchema = z.object({
	user: authUserSchema,
	token: z.string().optional(),
});

export const userStatusSchema = z.object({
	userId: z.string(),
});

export const userDiscountSearchSchema = z.object({
	identificationId: z.string(),
});

export const userDiscountSchema = z.object({
	userId: z.string(),
	discount: z.number().default(20),
});

export type UserStatusForm = z.infer<typeof userStatusSchema>;
export type UserDiscountForm = z.infer<typeof userDiscountSchema>;
export type UserDiscountSearch = z.infer<typeof userDiscountSearchSchema>;
export type UsersCompleteResponse = z.infer<typeof usersResponseSchema>;
export type UsersResponse = Pick<UsersCompleteResponse, "users">;
