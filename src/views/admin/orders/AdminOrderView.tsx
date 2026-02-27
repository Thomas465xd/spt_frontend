import { getOrdersAdmin } from "@/api/OrderAPI";
import OrderTable from "@/components/orders/OrderTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Package, Pen, Truck, XCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";

const orderStatusOptions = [
    {
        value: "Pendiente",
        label: "Pendiente",
        icon: Package,
        color: "text-yellow-600"
    },
    {
        value: "En Transito",
        label: "En Tránsito",
        icon: Truck,
        color: "text-blue-600"
    },
    {
        value: "Entregado",
        label: "Entregado",
        icon: CheckCircle,
        color: "text-green-600"
    },
    {
        value: "Cancelado",
        label: "Cancelado",
        icon: XCircle,
        color: "text-red-600"
    }
];

export default function AdminOrdersView() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get search parameters
    const searchCountry = searchParams.get("country") || "";
    const searchStatus = searchParams.get("status") || "";
    const searchBusinessId = searchParams.get("businessId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const itemsPerPage = 10;

    // Fetch orders with filters
    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders", searchCountry, searchBusinessId, searchStatus, page],
        queryFn: () => getOrdersAdmin({
            perPage: itemsPerPage, 
            page, 
            country: searchCountry, 
            status: searchStatus, 
            businessId: searchBusinessId
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
    }, [searchCountry, searchStatus, searchBusinessId]);
    
    if (page < 1) return <Navigate to={`/admin/orders?page=1`} replace />;

    if (isLoading) return <Loader />;

    if (isError) return <Navigate to="/404" replace />;

    // Get data from API response
    const orders = data?.orders || [];
    const totalOrders = data?.totalOrders || 0;
    const totalPages = data?.totalPages || 1;

    // Check if there are any active searches
    const hasActiveSearch = searchCountry || searchStatus || searchBusinessId;

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
                route="orders"
                param="orderId"
                inputType="text"
                formText="Buscar Orden por ID "
                mini
                searchText="Orden"
            />
            
            {hasActiveSearch && (
                <>
                    <SearchBar
                        route="admin/orders"
                        param="businessId"
                        inputType="text"
                        formText="Buscar Orden por ID de la Empresa"
                        searchText="Empresa"
                    />
        
                    <SearchBar
                        route="admin/orders"
                        param="country"
                        inputType="text"
                        formText="Buscar Orden por País. Ej. Chile"
                        searchText="País"
                    />
        
                    <SearchBar
                        route="admin/orders"
                        param="status"
                        inputType="select"
                        formText="Buscar Orden por su Estado. Ej. Pendiente"
                        searchText="Estado"
                        options={orderStatusOptions}
                    />
                </>
            )}

            <div className="flex justify-center mt-8">
                <Link
                    to={"/admin/orders/create"}
                    className="flex items-center gap-2 rounded-md bg-orange-600 px-8 py-3 text-sm text-center font-bold text-white shadow-xs transition-colors duration-200 hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                    <Pen size={16} />
                    Registrar Orden
                </Link>
            </div>

            {hasActiveSearch ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron órdenes con los filtros aplicados
                </p>
            ) : (
                <p className="text-gray-700 text-center my-10 border-b border-gray-300 pb-5">
                    No hay órdenes registradas. Realiza una búsqueda o comienza a registrar nuevas ordenes.
                </p>
            )}

            {hasActiveSearch && (
                <div className="flex gap-5 justify-center my-10">
                    <Link
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-full transition-colors"
                        to="/admin/orders"
                    >
                        Volver a Todas las Órdenes
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
                route="orders"
                param="orderId"
                inputType="text"
                formText="Buscar Orden por ID "
                mini
                searchText="Orden"
            />

            <SearchBar
                route="admin/orders"
                param="businessId"
                inputType="text"
                formText="Buscar Orden por ID de la Empresa"
                searchText="Empresa"
            />

            <SearchBar
                route="admin/orders"
                param="country"
                inputType="text"
                formText="Buscar Orden por País. Ej. Chile"
                searchText="País"
            />

            <SearchBar
                route="admin/orders"
                param="status"
                inputType="select"
                formText="Buscar Orden por su Estado. Ej. Pendiente"
                searchText="Estado"
                options={orderStatusOptions}
            />

            <p className="text-gray-700 text-center my-10">
                Al cambiar el estado de la orden, el cliente <span className="font-bold text-orange-500">será notificado por correo</span>
            </p>

            {hasActiveSearch && (
                <>
                    <div className="text-center mt-10 mb-10">
                        <Link
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-full transition-colors"
                            to="/admin/orders"
                        >
                            Volver a Todas las Órdenes
                        </Link>
                    </div>

                    <p className="text-gray-700 text-center mt-10">
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