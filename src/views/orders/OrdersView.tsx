import { getOrdersByEmail } from "@/api/OrderAPI";
import OrderCard from "@/components/orders/OrderCard";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function OrdersView() {
    const [showPendingOnly, setShowPendingOnly] = useState(false);
    const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useAuth();
    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchOrder = searchParams.get("searchOrder") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    
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
    
    // Add pendingOnly to queryKey to refetch when toggle changes
    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders", searchOrder, user?.email, page],
        queryFn: () => getOrdersByEmail({
            email: user?.email || "",
            token: searchOrder, 
            limit: itemsPerPage,
            offset: offset,
        }),
        // Add a select to ensure data is always in a safe format
        select: (responseData) => ({
            data: responseData?.data?.map(order => ({
                ...order,
                pickName: order.pickName || '',
                pickCode: order.pickCode || '',
                // Add other fields with safe defaults
            })) || [],
            count: responseData?.count || 0
        }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (page !== 1) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", "1");
            setSearchParams(newParams);
        }
    }, [showPendingOnly]);
    
    if(page < 1) return <Navigate to={`/orders?page=1`} replace />

    const itemsPerPage = 6; 
    const offset = (page - 1) * itemsPerPage;
    

    const orders = data?.data;
    const totalOrders = data?.count || 0;

    // Filter orders if we're showing pending only
    const filteredOrders = showPendingOnly && orders 
        ? orders.filter(order => order.active === 1).slice(offset, offset + itemsPerPage)
        : orders;
    
    // Calculate total count for pagination
    const filteredCount = showPendingOnly && data?.data
        ? data.data.filter(order => order.active === 1).length
        : totalOrders;

    const totalPages = Math.ceil(filteredCount / itemsPerPage);

    // Reset to page 1 when toggling filter

    if(isLoading || isLoadingUser) return <Loader />

    if(isError || isErrorUser) return <Navigate to="/404" replace />

    if(orders?.length === 0 || (filteredOrders && filteredOrders.length === 0)) return (
        <>
            <Heading>{searchOrder ? (
                `Orden no Encontrada`
            ) : (
                `Mis Pedidos`
            )}</Heading>

            {!searchOrder && (
                <p className="text-gray-700 text-center my-10 ">
                    Aquí puedes ver los Detalles de tus Ordenes y <span className="font-bold text-orange-500">Realizar Cambios.</span>
                </p>
            )}

            {searchOrder ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron Ordenes con el Tóken: <span className="font-bold text-orange-500">{searchOrder}</span>
                </p>
            ) : showPendingOnly ? (
                <p className="text-gray-700 text-center my-10">
                    No tienes Ordenes Pendientes
                </p>
            ) : (
                <p className="text-gray-700 text-center my-10">
                    Aún no tienes Ordenes Registradas
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

                {showPendingOnly && !searchOrder && (
                    <button
                        className="bg-yellow-500 text-white px-5 py-2 rounded-full"
                        onClick={() => setShowPendingOnly(false)}
                    >
                        Ver Todas las Órdenes
                    </button>
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
    if(page > totalPages && totalPages > 0) return <Navigate to={`/orders?page=${totalPages}`} replace />

    if(orders) return (
        <>
            <Heading>Mis Pedidos</Heading>
            <p className="text-gray-700 text-center my-5">
                Aquí puedes ver los Detalles de tus Ordenes y <span className="font-bold text-orange-500">Realizar Cambios.</span>
            </p>

            {/* Toggle switch for pending orders */}
            <div className="flex items-center justify-center mb-5">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">
                        {showPendingOnly ? "Mostrando órdenes pendientes" : "Mostrando todas las órdenes"}
                    </span>
                    <button
                        onClick={() => setShowPendingOnly(!showPendingOnly)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            showPendingOnly ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}
                        aria-label={showPendingOnly ? "Show all orders" : "Show only pending orders"}  // Accessible name for the button
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                showPendingOnly ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className="text-sm text-gray-500">
                        Solo pendientes
                    </span>
                </div>
            </div>

            <SearchBar
                route="orders"
                param="searchOrder"
                inputType="text"
                formText="Buscar Pedido por Tóken de la Orden. Ej. #ce5839f2"
                searchText="Pedido"
            />

            <p className="text-gray-700 text-center my-10">
                Puedes copiar el Tóken de la Orden <span className="font-bold text-orange-500">haciendo Click sobre el</span>
                <br/> El estado de la Orden se actulizará cuando <span className="font-bold text-orange-500">el Pedido sea Confirmado</span>
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

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 my-10">
                {filteredOrders && filteredOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        admin={false}
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