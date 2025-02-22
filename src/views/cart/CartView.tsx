import CartTable from "@/components/cart/CartTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useCart } from "@/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CartView() {

    const { cartId, fetchCartDetails, clearCart } = useCart();
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cartDetails", cartId],
        queryFn: fetchCartDetails,
        enabled: !!cartId,
    });

    const handleClearCart = () => {
        Swal.fire({
            title: "Limpiar Carrito",
            text: "Estas seguro de limpiar el carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Limpiar",
            cancelButtonText: "No, Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart();
            }
        })
    }

    const cartDetails = data?.data;
    
    if(isLoading) return <Loader />

    if(isError) return <Navigate to="/404" replace />

    return (
        <>
            <Heading>Carrito de Compras 🛒</Heading>

            <p className="text-center text-gray-700 my-4">
                Revisa el resúmen de tu compra para después poder 
                <span className="font-bold text-orange-500"> Emitir una Orden</span>
            </p>

            <CartTable
                cartDetails={cartDetails || []}
            />

            <div className="flex justify-center mt-10">
                <button 
                    className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition duration-300"
                    onClick={() =>  navigate("/cart/checkout") }
                >
                    Ir a Emitir Orden
                </button>

                <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300 ml-4"
                    onClick={handleClearCart}
                >
                    Limpiar Carrito
                </button>
            </div>
        </>
    )
}
