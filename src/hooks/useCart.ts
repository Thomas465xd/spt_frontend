import { useState, useEffect } from "react";
import { getCartDetailById, addToCart, updateCart } from "@/api/ProductAPI";
import { CartForm } from "../types";
import { toast } from "react-toastify";

export function useCart() {
    const [cartId, setCartId] = useState<number | null>(null);

    // Cargar cartId desde localStorage cuando el hook se monta
    useEffect(() => {
        const storedCartId = localStorage.getItem("cartId");
        if (storedCartId) {
            setCartId(Number(storedCartId));
        }
    }, []);

    // Función para obtener detalles del carrito
    const fetchCartDetails = async () => {
        if (!cartId) return null;
        return await getCartDetailById(cartId);
    };

    // Función para agregar al carrito (crea uno nuevo si no existe)
    const addItemToCart = async (formData: CartForm) => {
        try {
            if (!cartId) {
                const newCartId = await addToCart(formData);
                setCartId(newCartId);
                toast.success("Producto añadido al carrito");
                return newCartId;
            } else {
                await updateCart({ formData, cartId });
                toast.success("Producto añadido al carrito");
                return cartId;
            }
        } catch (error) {
            toast.error("Error al agregar producto al carrito:");
            console.error("Error al agregar producto al carrito:", error);
            return null;
        }
    };

    //! REVISAR Función para limpiar carrito (por ejemplo, después del checkout) 
    const clearCart = () => {
        localStorage.removeItem("cartId");
        setCartId(null);
    };

    return { cartId, fetchCartDetails, addItemToCart, clearCart };
}
