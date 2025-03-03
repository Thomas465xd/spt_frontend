import { getAllOrders } from "@/api/OrderAPI";
import OrderCard from "@/components/orders/OrderCard";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useSearchParams } from "react-router-dom";

export default function AdminOrdersView() {

    const [searchParams] = useSearchParams();
    const searchToken = searchParams.get("searchToken") || "";
    const searchEmail = searchParams.get("searchEmail") || "";
    const searchName = searchParams.get("searchName") || "";
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    if(page < 1) return <Navigate to={`/orders?page=1`} replace />

    const itemsPerPage = 4; 

    // Calculamos el offset
    const offset = (page - 1) * itemsPerPage;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders", searchToken, searchEmail, searchName, page],
        queryFn: () => getAllOrders({
            email: searchEmail,
            clientName: searchName, 
            token: searchToken, 
            limit: itemsPerPage, 
            offset
        }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })

    const orders = data?.data;

    const totalOrders = data?.count || 0;

    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    if(isLoading) return <Loader />

    if(isError) return <Navigate to="/404" replace />

    if(orders?.length === 0) return (
        <>
            <Heading>{searchToken ? (
                `Orden no Encontrada`
            ) : (
                `Mis Pedidos`
            )}</Heading>

            {!searchToken && (
                <p className="text-gray-700 text-center my-10 ">
                    Aquí puedes ver los Detalles de las Ordenes y <span className="font-bold text-orange-500">Administrarlas.</span>
                </p>
            )}

            {searchToken ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron Ordenes con el Tóken: <span className="font-bold text-orange-500">{searchToken}</span>
                </p>
            ) : (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron Ordenes Registradas
                </p>
            )}

            <div className="flex gap-5 justify-center my-10">
                {searchToken && (
                    <Link
                        className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                        to="/admin/orders"
                    >
                        Volver Ordenes
                    </Link>
                    
                )}
            </div>
        </>
    )

    if(orders) return (
        <>
            <Heading>Administrar Pedidos</Heading>

            <p className="text-gray-700 text-center mt-10">
                Aquí puedes administrar los pedidos de tus clientes
            </p>

            <SearchBar
                route="admin/orders"
                param="searchToken"
                inputType="text"
                formText="Buscar Pedido por Tóken de la Orden. Ej. #ce5839f2"
                searchText="Tóken"
            />

            <SearchBar
                route="admin/orders"
                param="searchEmail"
                inputType="email"
                formText="Buscar Pedido por Correo del Cliente. Ej. test@example.com"
                searchText="Email"
            />

            <SearchBar
                route="admin/orders"
                param="searchName"
                inputType="text"
                formText="Buscar Pedido por Nombre del Cliente. Ej. Jhon Doe"
                searchText="Nombre"
            />

            <p className="text-gray-700 text-center my-10">
                Puedes copiar el Tóken de la Orden <span className="font-bold text-orange-500">haciendo Click sobre el</span>
                <br/> Al Cambiar el estado de la Orden el cliente<span className="font-bold text-orange-500"> será notificado</span>
            </p>

            {searchToken || searchEmail || searchName ? (
                <>
                    <div className="text-center mt-10 mb-20">
                        <Link
                            className="bg-orange-500 text-white px-10 py-4 rounded-full"
                            to="/admin/orders"
                        >
                            Volver a Todas las Ordenes
                        </Link>
                    </div>

                    <p className="text-gray-700 text-center my-10">
                        Resultados Cargados: <span className="font-bold text-orange-500">{data.count}</span>
                    </p>
                </>
            ) : null}

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 my-10 md:px-10 lg:px-20 xl:px-30 2xl:px-40">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        admin={true}
                    />
                ))}
            </div>

            <Pagination
                route={"admin/orders"}
                page={page}
                totalPages={totalPages}
            />
        </>
    )
}
