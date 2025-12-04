import { getOrdersAdmin } from "@/api/OrderAPI";
import OrderTable from "@/components/orders/OrderTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";

export default function AdminOrdersView() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get search parameters
    const searchCountry = searchParams.get("country") || "";
    const searchStatus = searchParams.get("status") || "";
    const searchBusinessRut = searchParams.get("businessRut") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const itemsPerPage = 10;

    // Fetch orders with filters
    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders", searchCountry, searchBusinessRut, searchStatus, page],
        queryFn: () => getOrdersAdmin({
            perPage: itemsPerPage, 
            page, 
            country: searchCountry, 
            status: searchStatus, 
            businessRut: searchBusinessRut
        }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    // Reset to page 1 when toggling filter or changing search params
    useEffect(() => {
        if (page !== 1) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", "1");
            setSearchParams(newParams);
        }
    }, [searchCountry, searchStatus, searchBusinessRut]);
    
    if (page < 1) return <Navigate to={`/admin/orders?page=1`} replace />;

    if (isLoading) return <Loader />;

    if (isError) return <Navigate to="/404" replace />;

    // Get data from API response
    const orders = data?.orders || [];
    const totalOrders = data?.totalOrders || 0;
    const totalPages = data?.totalPages || 1;

    // Check if there are any active searches
    const hasActiveSearch = searchCountry || searchStatus || searchBusinessRut;

    if (orders.length === 0) return (
        <>
            <Heading>
                {hasActiveSearch ? "Orden no Encontrada" : "Administrar Órdenes"}
            </Heading>

            {!hasActiveSearch && (
                <p className="text-gray-700 text-center my-10">
                    Aquí puedes ver los Detalles de las Órdenes y <span className="font-bold text-orange-500">Administrarlas.</span>
                </p>
            )}
            
            <SearchBar
                route="admin/orders"
                param="businessRut"
                inputType="text"
                formText="Buscar Orden por RUT del Negocio. Ej. 12.345.678-9"
                searchText="RUT Negocio"
            />

            <SearchBar
                route="admin/orders"
                param="country"
                inputType="text"
                formText="Buscar Orden por País. Ej. Chile"
                searchText="País"
            />

            {hasActiveSearch ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron órdenes con los filtros aplicados
                </p>
            ) : (
                <p className="text-gray-700 text-center my-10 border-b border-gray-300 pb-5">
                    No hay órdenes registradas. Realiza una búsqueda o espera a que se registren nuevas órdenes.
                </p>
            )}

            {hasActiveSearch && (
                <div className="flex gap-5 justify-center my-10">
                    <Link
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition-colors"
                        to="/admin/orders"
                    >
                        Volver a Órdenes
                    </Link>
                </div>
            )}
        </>
    );

    return (
        <>
            <Heading>Administrar Órdenes</Heading>

            <p className="text-gray-700 text-center mt-10">
                Aquí puedes administrar las órdenes de tus clientes
            </p>

            <SearchBar
                route="admin/orders"
                param="businessRut"
                inputType="text"
                formText="Buscar Orden por RUT de la Empresa. Ej. 12.345.678-9"
                searchText="RUT Empresa"
            />

            <SearchBar
                route="admin/orders"
                param="country"
                inputType="text"
                formText="Buscar Orden por País. Ej. Chile"
                searchText="País"
            />

            <p className="text-gray-700 text-center my-10">
                Al cambiar el estado de la orden, el cliente <span className="font-bold text-orange-500">será notificado por correo</span>
            </p>

            {hasActiveSearch && (
                <>
                    <div className="text-center mt-10 mb-10">
                        <Link
                            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full transition-colors"
                            to="/admin/orders"
                        >
                            Volver a Todas las Órdenes
                        </Link>
                    </div>

                    <p className="text-gray-700 text-center my-10">
                        Órdenes encontradas: <span className="font-bold text-orange-500">{totalOrders}</span>
                    </p>
                </>
            )}

            <div className="my-[32px] max-w-7xl xl:max-w-full mx-auto">
                <OrderTable
                    admin={true}
                    orders={orders}
                />
            </div>

            {totalPages > 1 && (
                <Pagination
                    route="admin/orders"
                    page={page}
                    totalPages={totalPages}
                />
            )}
        </>
    );
}