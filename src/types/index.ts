import { z } from "zod";

export const userSchema = z.object({
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
})

export const registerSchema = userSchema.pick({
    name: true, 
    businessName: true,
    rut: true,
    businessRut: true,
    email: true,
    phone: true,
    address: true,
})

export const loginSchema = userSchema.pick({
    rut: true, 
    email: true, 
    password: true
})

export const tokenSchema = z.object({
    token: z.string(),
    type: z.enum(["admin_confirmation", "password_reset"]),
    userId: z.string(),
})

export const setPasswordSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})

export type User = z.infer<typeof userSchema>;
export type UserRegistrationForm = z.infer<typeof registerSchema>;
export type UserLoginForm = z.infer<typeof loginSchema>;
export type ConfigurePasswordForm = z.infer<typeof setPasswordSchema>;
export type Token = z.infer<typeof tokenSchema>;
export type PasswordToken = Pick<Token, "token">;