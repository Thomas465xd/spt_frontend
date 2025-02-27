import { getOrdersByEmail } from "@/api/OrderAPI";
import OrderCard from "@/components/orders/OrderCard";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function OrdersView() {

    const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useAuth();
    const location = useLocation();

    const [searchParams] = useSearchParams();
    const searchOrder = searchParams.get("searchOrder") || "";
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    if(page < 1) return <Navigate to={`/orders?page=1`} replace />

    const itemsPerPage = 4; 

    // Calculamos el offset
    const offset = (page - 1) * itemsPerPage;

    useEffect(() => {
        if (location.state?.message) {
            const { message, type } = location.state;
            if (type === "success") {
                toast.success(message);
            } else if (type === "error") {
                toast.error(message);
            }
        }    
    }, [location]);

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

    const orders = data?.data;
    const totalOrders = data?.count || 0;

    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    if(isLoading || isLoadingUser) return <Loader />

    if(isError || isErrorUser) return <Navigate to="/404" replace />

    if(orders?.length === 0) return (
        <>
            <Heading>{searchOrder ? (
                `Orden no Encontrada`
            ) : (
                `Mis Pedidos`
            )}</Heading>

            {!searchOrder && (
                <p className="text-gray-700 text-center my-10 ">
                    Aquí puedes ver los Detalles de tus Ordenes y <span className="font-bold text-orange-500">Realizar Cambios.</span>
                </p>
            )}

            {searchOrder ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron Ordenes con el Tóken: <span className="font-bold text-orange-500">{searchOrder}</span>
                </p>
            ) : (
                <p className="text-gray-700 text-center my-10">
                    Aún no tienes Ordenes Registradas
                </p>
            )}

            <div className="flex gap-5 justify-center my-10">
                <Link
                    className=" bg-slate-700 text-white px-5 py-2 rounded-full"
                    to="/cart"
                >
                    Ir a tu Carrito
                </Link>
                

                {searchOrder && (
                    <Link
                        className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                        to="/orders"
                    >
                        Volver a mis Ordenes
                    </Link>
                    
                )}

                <Link
                    className=" bg-slate-500 text-white px-5 py-2 rounded-full"
                    to="/products"
                >
                    Ir a Productos
                </Link>
            </div>
        </>
    )

    if(totalPages === 0 || page === 0) return (
        <>
            <Heading>Orden no Encontrada</Heading>

            <p className="text-center text-gray-500 my-10">No se encontraron Ordenes con el Tóken: <span className="font-bold italic">"{searchParams.get("searchOrder") ? searchParams.get("searchOrder") : searchParams.get("searchOrder")}"</span></p>

            <div className="flex gap-5 justify-center my-10">
                <Link
                    className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                    to="/orders?page=1"
                >
                    Volver a mis Ordenes
                </Link>
            </div>
        </>
    )

    // Si la página es mayor que el total de páginas, redirigimos a la última página
    if(page > totalPages) return <Navigate to={`/orders?page=${totalPages}`} replace />

    if(orders) return (
        <>
            <Heading>Mis Pedidos</Heading>
            <p className="text-gray-700 text-center my-10">
                Aquí puedes ver los Detalles de tus Ordenes y <span className="font-bold text-orange-500">Realizar Cambios.</span>
            </p>

            <SearchBar
                route="orders"
                param="searchOrder"
                inputType="text"
                formText="Buscar Pedido por Tóken de la Orden. Ej. #ce5839f2"
                searchText="Pedido"
            />

            <p className="text-gray-700 text-center my-10">
                Puedes copiar el Tóken de la Orden <span className="font-bold text-orange-500">haciendo Click sobre el</span>
            </p>

            {searchOrder && (
                <div className="text-center mt-10 mb-20">
                    <Link
                        className="bg-orange-500 text-white px-10 py-4 rounded-full"
                        to="/orders"
                    >
                        Volver a mis Ordenes
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 my-10">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                    />
                ))}
            </div>

            <div className="flex gap-5 justify-center mt-15 mb-10">
                <Link
                    className=" bg-slate-700 text-white px-5 py-2 rounded-full"
                    to="/cart"
                >
                    Ir a tu Carrito
                </Link>

                <Link
                    className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                    to="/products"
                >
                    Ir a Productos
                </Link>
            </div>

            <Pagination 
                route={"orders"}
                page={page}
                totalPages={totalPages}
            />
        </>
    )
}
