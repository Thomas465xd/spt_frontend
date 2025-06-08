import { getUnconfirmedUsers } from "@/api/AdminAPI";
import AdminConfirmedTable from "@/components/admin/AdminConfirmedTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { formatRUT } from "@/utilities/rut";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useSearchParams } from "react-router-dom";

export default function AdminUnconfirmedUsersView() {
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present
    const searchRUT = searchParams.get("searchRUT") || ""; // Obtener el término de búsqueda
    const searchEmail = searchParams.get("searchEmail") || "";

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['unconfirmedUsers', page, searchRUT, searchEmail], // Ensure 'page' is passed as part of the queryKey
        queryFn: () => getUnconfirmedUsers({ page, perPage: itemsPerPage, searchRUT, searchEmail }), // Send page and perPage to the API
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    if(page < 1) return <Navigate to={`/admin/confirm?page=1`} replace />

    const itemsPerPage = 5; 

    const users = data?.users || [];
    const totalUsers = data?.totalUsers || 0; // Assuming totalUsers is returned from the API

    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    if(isLoading) return <Loader />

    if(isError) return <Navigate to="/404" replace/>

    if(totalPages === 0 && page > totalPages) return (
        <>
            <Heading>{searchRUT || searchEmail ? (
                `Usuario no Encontrado`
            ) : (
                `Administración de Usuarios no Confirmados`
            )}</Heading>

            {searchRUT || searchEmail ? (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron Usuarios Registrados para {searchRUT ? "el RUT" : "el Email"}: <span className="font-bold text-orange-500">{searchRUT || searchEmail}</span>
                </p>
            ) : (
                <p className="text-gray-700 text-center my-10">
                    No se encontraron Usuarios sin Confirmar
                </p>
            )}

            <div className="flex gap-5 justify-center my-10">
                {searchRUT || searchEmail ? (
                    <Link
                        className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                        to="/admin/confirm"
                    >
                        Volver a Usuarios
                    </Link>
                ) : (
                    <Link
                        className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                        to="/admin/dashboard"
                    >
                        Volver al Dashboard
                    </Link>
                )}
            </div>
        </>
    )

    if(page > totalPages) return <Navigate to={`/admin/confirm?page=${totalPages}`} replace />
    
    return (
        <>
            <Heading>Administración de usuarios no Confirmados</Heading>

            <p className="text-center text-gray-500 mt-10">Listado de usuarios no confirmados.</p>

            {/** To do: Search Bar */}
            <SearchBar
                route="admin/confirm"
                param="searchRUT"
                inputType="text"
                formText="Buscar por RUT (12.345.678-9)"
                searchText="Usuario"
            />

            <SearchBar
                route="admin/confirm"
                param="searchEmail"
                inputType="text"
                formText="Buscar por Email (correo@example.com"
                searchText="Usuario"
            />

            {searchEmail || searchRUT ? (
                <>
                    <p className="text-center text-gray-500 mt-10">Resultados de Búsqueda para: {searchRUT ? formatRUT(searchRUT) : searchEmail}</p>

                    <div className="flex gap-5 justify-center my-5">
                        <Link
                            className=" bg-orange-500 text-white px-5 py-2 rounded-full"
                            to="/admin/confirm"
                        >
                            Volver a Usuarios
                        </Link>
                    </div>
                </>
            ) : null}

            <AdminConfirmedTable 
                type="unconfirmed"
                users={users} 
                isLoading={isLoading} 
                error={error} 
            />  {/* Pass the required props to the table */}

            <Pagination
                route="admin/confirm"
                page={page}
                totalPages={totalPages}
            />
        </>
    );
}
