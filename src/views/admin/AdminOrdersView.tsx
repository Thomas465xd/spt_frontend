import { getOrdersByEmail } from "@/api/OrderAPI";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";

export default function AdminOrdersView() {

    /*
    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders", searchOrder, user?.email, page],
        queryFn: () => getOrdersByEmail({
            email: user?.email || "",
            token: searchOrder, 
            limit: itemsPerPage, 
            offset
        }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })


    if(isLoading) return <Loader/>

    if(isError) return <Navigate to="/404" replace />

    */

    return (
        <>
            <Heading>Administrar Pedidos</Heading>

            <p className="text-gray-700 text-center mt-10">
                Aquí puedes administrar los pedidos de tus clientes
            </p>
        </>
    )
}
