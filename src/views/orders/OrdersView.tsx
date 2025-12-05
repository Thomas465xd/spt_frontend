import { getOrdersUser } from "@/api/OrderAPI";
import OrderTable from "@/components/orders/OrderTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Package, Truck, XCircle } from "lucide-react";
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

export default function OrdersView() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: userData, isLoading: isLoadingUser, isError: isErrorUser } = useAuth(); 
    
    // Get search parameters
    const searchCountry = searchParams.get("country") || "";
    const searchStatus = searchParams.get("status") || "";
    const searchOrderId = searchParams.get("orderId") || ""; 
    const page = parseInt(searchParams.get("page") || "1", 10);

    const itemsPerPage = 10;

    // Fetch orders with filters
    const { data, isLoading, isError } = useQuery({
        queryKey: ["orders", searchCountry, searchStatus, searchOrderId, page],
        queryFn: () => getOrdersUser({
            perPage: itemsPerPage, 
            page, 
            country: searchCountry, 
            status: searchStatus, 
            orderId: searchOrderId
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
    }, [searchCountry, searchStatus, searchOrderId]);
    
    if (page < 1) return <Navigate to={`/orders?page=1`} replace />;

    if (isLoading || isLoadingUser) return <Loader />;

    if (isError || isErrorUser) return <Navigate to="/404" replace />;

    // Get data from API response
    const orders = data?.orders || [];
    const totalOrders = data?.totalOrders || 0;
    const totalPages = data?.totalPages || 1;

    // Check if there are any active searches
    const hasActiveSearch = searchCountry || searchStatus || searchOrderId;

    if (orders.length === 0) return (
        <>
            <Heading>
                {hasActiveSearch ? "Orden no Encontrada" : "Ver Órdenes"}
            </Heading>

            {!hasActiveSearch && (
                <p className="text-gray-700 text-center my-10">
                    Aquí puedes ver el Estado de las ordenes realizadas por tu Empresa
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
            
            <SearchBar
                route="orders"
                param="country"
                inputType="text"
                formText="Buscar Orden por País. Ej. Chile"
                searchText="País"
            />
        
            <SearchBar
                route="orders"
                param="status"
                inputType="select"
                formText="Buscar Orden por su Estado. Ej. Pendiente"
                searchText="Estado"
                options={orderStatusOptions}
            />

            {hasActiveSearch ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron órdenes con los filtros aplicados, <span className="text-orange-500">"{searchCountry || searchStatus || searchOrderId}"</span>
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
                        to="/orders"
                    >
                        Volver a Órdenes
                    </Link>
                </div>
            )}
        </>
    );

    return (
        <>
            <Heading>Ver Órdenes <span className="text-orange-500">{userData?.businessName}</span></Heading>

            <p className="text-gray-700 text-center mt-10">
                Aquí puedes ver el Estado de las ordenes realizadas por tu Empresa.
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
                route="orders"
                param="country"
                inputType="text"
                formText="Buscar Orden por País. Ej. Chile"
                searchText="País"
            />

            <SearchBar
                route="orders"
                param="status"
                inputType="select"
                formText="Buscar Orden por su Estado. Ej. Pendiente"
                searchText="Estado"
                options={orderStatusOptions}
            />

            <p className="text-gray-700 text-center mt-10">
                Cuando el Estado de la orden cambie, <span className="font-bold text-orange-500">serás notificado por correo</span>
            </p>

            {hasActiveSearch && (
                <>
                    <div className="text-center mt-10">
                        <Link
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-full transition-colors"
                            to="/orders"
                        >
                            Volver a Todas las Órdenes
                        </Link>
                    </div>

                    <p className="text-gray-700 text-center my-10">
                        Órdenes encontradas: <span className="font-bold text-orange-500">{totalOrders}</span>
                    </p>
                </>
            )}

            <div className="max-w-7xl xl:max-w-full mx-auto rounded-md">
                <OrderTable
                    orders={orders}
                    admin={false}
                />
            </div>

            {totalPages > 1 && (
                <Pagination
                    route="/orders"
                    page={page}
                    totalPages={totalPages}
                />
            )}
        </>
    );
}