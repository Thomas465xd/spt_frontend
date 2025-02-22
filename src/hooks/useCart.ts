import { useState, useEffect } from "react";
import { getCartDetailById, addToCart, updateCart, deleteCart } from "@/api/ProductAPI";
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
                localStorage.setItem("cartId", newCartId.toString());
                toast.success("Producto añadido al carrito");
                window.location.reload();
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

    // Function to delete an item from the cart and update state in real time
    const deleteItemFromCart = async (detailId: number) => {
        try {
            if (!cartId) return;
    
            const updatedCart = await deleteCart({ cartId, detailId });
    
            if (!updatedCart) {
                // Si el carrito está vacío, eliminar el cartId
                localStorage.removeItem("cartId");
                setCartId(null);
                toast.success("Último producto eliminado. Carrito vacío.");
            } else {
                toast.success("Producto eliminado del carrito");
            }
        } catch (error) {
            toast.error("Error al eliminar producto del carrito");
            console.error("Error al eliminar producto del carrito:", error);
        }
    };

    //! REVISAR Función para limpiar carrito (por ejemplo, después del checkout) 
    const clearCart = () => {
        localStorage.removeItem("cartId");
        setCartId(null);
        window.location.reload();
        toast.success('Carrito Reiniciado')
    };

    return { cartId, fetchCartDetails, addItemToCart, deleteItemFromCart, clearCart };
}
