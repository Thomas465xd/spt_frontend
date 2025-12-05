import { z } from "zod";

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

export const userStatusSchema = z.object({
    userId: z.string(),
});

export const userDiscountSearchSchema = z.object({
    rut: z.string()
})

export const userDiscountSchema = z.object({
    userId: z.string(), 
    discount: z.number().default(20), 
})

export type AdminTableUser = z.infer<typeof adminTableUserSchema>
export type UserStatusForm = z.infer<typeof userStatusSchema>;
export type UserDiscountForm = z.infer<typeof userDiscountSchema>;
export type UserDiscountSearch = z.infer<typeof userDiscountSearchSchema>;
export type UsersCompleteResponse = z.infer<typeof usersResponseSchema>;
export type UsersResponse = Pick<UsersCompleteResponse, "users">;