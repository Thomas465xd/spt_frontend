import { z } from "zod";
import { authUserSchema } from "./auth";

// TODO: Work on Types regarding Orders
export const orderStatusSchema = z.enum([
    "Pendiente",
    "En Transito",
    "Entregado",
    "Cancelado"
])

export const orderItemSchema = z.object({
    sku: z.string().min(1, "SKU es requerido"), 
    name: z.string().min(1, "Nombre es requerido"), 
    price: z.number().min(0, "El precio debe ser mayor o igual a 0"), 
    quantity: z.number().int().min(1, "La cantidad debe ser al menos 1"), 
    lineTotal: z.number().min(0, "El total de línea debe ser mayor o igual a 0")
}).refine((data) => {
    // Validate that lineTotal = price * quantity
    const calculatedTotal = data.price * data.quantity;
    return Math.abs(data.lineTotal - calculatedTotal) < 0.01;
}, {
    message: "El total de línea debe ser igual a precio × cantidad",
    path: ["lineTotal"]
});

export const orderSchema = z.object({
    _id: z.string(),
    items: z.array(orderItemSchema).min(1, "Debe haber al menos un producto"), 
    payment: z.string().min(1, "Método de pago es requerido"), 
    shipper: z.string().min(1, "Expedidor es requerido"), 
    trackingNumber: z.string().min(1, "Tracking Number es requerido"),
    status: orderStatusSchema,
    country: z.string().min(1, "País es requerido"), 
    total: z.number().min(0, "El total debe ser mayor o igual a 0"),
    businessName: z.string().min(1, "Nombre del negocio es requerido"), 
    businessRut: z.string().min(1, "RUT del negocio es requerido"), 
    user: z.union([z.string(), authUserSchema]), // For populated or unpopulated

    estimatedDelivery: z.string().or(z.date()), // API returns ISO string, but could be Date
    deliveredAt: z.string().or(z.date()).nullable(), // Same here

    createdAt: z.string().or(z.date()), // API returns ISO string, but could be Date
    updatedAt: z.string().or(z.date())  // Same here
}).refine((data) => {
    // Validate that total = sum of all lineTotal values
    const calculatedTotal = data.items.reduce((sum, item) => sum + item.lineTotal, 0);
    return Math.abs(data.total - calculatedTotal) < 0.01;
}, {
    message: "El total debe ser igual a la suma de todos los productos",
    path: ["total"]
});

export const getOrdersResponseSchema = z.object({
    orders: z.array(orderSchema), 
    businessRut: z.string().optional(), // For user orders
    totalOrders: z.number(), 
    totalPages: z.number(), 
    perPage: z.number(), 
    currentPage: z.number()
})

export const updateOrderResponseSchema = z.object({
    order: orderSchema, 
    message: z.string(), 
})

export const updateOrderStatusSchema = z.object({
    status: orderStatusSchema
});

export type Order = z.infer<typeof orderSchema>;
export type OrderStatusEnum = z.infer<typeof orderStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>
export type OrderForm = Pick<Order, "items" | "businessName" | "businessRut" | "payment" | "shipper" | "country" | "total" | "user" | "status" | "estimatedDelivery" | "trackingNumber" | "deliveredAt">;
export type OrderStatusForm = z.infer<typeof updateOrderStatusSchema>;
export type GetOrdersResponse = z.infer<typeof getOrdersResponseSchema>;