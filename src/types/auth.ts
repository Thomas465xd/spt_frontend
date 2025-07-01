import { z } from "zod";

/** Auth & Admin */

export const regionSchema = z.enum([
    "Arica y Parinacota", 
    "Tarapacá", 
    "Antofagasta", 
    "Atacama", 
    "Coquimbo", 
    "Valparaíso", 
    "Metropolitana de Santiago", 
    "O'Higgins", 
    "Maule", 
    "Ñuble", 
    "Biobío", 
    "La Araucanía", 
    "Los Ríos", 
    "Los Lagos", 
    "Aysén", 
    "Magallanes"
]);

export const userSchema = z.object({
    _id: z.string(),
    name: z.string(),
    businessName: z.string(),
    rut: z.string(),
    businessRut: z.string(),
    email: z.string().email(),
    phone: z.string(),
    confirmed: z.boolean(),
    passwordSet: z.boolean(),
    admin: z.boolean(),
    password: z.string().min(8),
    address: z.string(),

    discount: z.number().min(0).max(100).optional(),

    country: z.string().optional(),
    region: regionSchema.optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    reference: z.string().optional(),
    postalCode: z.string().optional(),
});

export const authUserSchema = z.object({
    _id: z.string(),

    name: z.string(),
    businessName: z.string(),
    rut: z.string(),
    businessRut: z.string(),
    email: z.string().email(),
    phone: z.string(),
    admin: z.boolean(),
    address: z.string(),

    discount: z.number().min(0).max(100).optional(),

    country: z.string().optional(),
    region: regionSchema.optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    reference: z.string().optional(),
    postalCode: z.string().optional(),
})

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

export type User = z.infer<typeof userSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type UserRegistrationForm = z.infer<typeof registerSchema>;
export type UserLoginForm = z.infer<typeof loginSchema>;
export type ForgotPasswwordForm = z.infer<typeof forgotPasswordSchema>;
export type ConfigurePasswordForm = z.infer<typeof setPasswordSchema>;
export type Token = z.infer<typeof tokenSchema>;
export type PasswordToken = Pick<Token, "token">;
export type UserUpdatePasswordForm = z.infer<typeof updatePasswordSchema>;
export type UserProfileForm = Pick<
    User,
    "name" | "businessName" | "email" | "phone" | "address"
>;
export type UserShippingForm = Pick<
    User,
    "country" | "region" | "city" | "province" | "reference" | "postalCode"
>;