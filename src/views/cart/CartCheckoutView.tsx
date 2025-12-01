import CheckoutForm from "@/components/orders/bsale/CheckoutForm";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

export default function CartCheckoutView() {

    const { data: user, isError: userIsError, isLoading: userIsLoading } = useAuth();

    const { cartId, fetchCartDetails } = useCart();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["cartDetails", cartId],
        queryFn: fetchCartDetails,
        enabled: !!cartId,
    });

    const cartDetails = data?.data;
    
    if(isLoading || userIsLoading) return <Loader />

    if(isError || userIsError) return <Navigate to="/404" replace />

    if(user) return (
        <>
            <Heading>Checkout</Heading>

            <p className="text-gray-700 text-center my-10">Antes de poder emitir una orden debemos <span className="font-bold text-orange-500">confirmar algunos datos.</span></p>

            <CheckoutForm 
                cartDetails={cartDetails || []}
                user={user}
            />
        </>
    )
}
