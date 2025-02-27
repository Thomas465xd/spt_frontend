import { getConfirmedUsers } from "@/api/AdminAPI";
import AdminConfirmedTable from "@/components/admin/AdminConfirmedTable";
import UsersPagination from "@/components/admin/UsersPagination";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import SearchBar from "@/components/ui/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useSearchParams } from "react-router-dom";

export default function AdminUsersView() {
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    if(page < 1) return <Navigate to={`/admin/dashboard/users?page=1`} replace />

    const itemsPerPage = 5; 

    const { data, isLoading, error } = useQuery({
        queryKey: ['confirmedUsers', page], // Ensure 'page' is passed as part of the queryKey
        queryFn: () => getConfirmedUsers({ page, perPage: itemsPerPage }), // Send page and perPage to the API
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const users = data?.users || [];
    const totalUsers = data?.totalUsers || 0; // Assuming totalUsers is returned from the API

    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    if(isLoading) return <Loader />

    if(totalPages === 0 || page === 0) return (
        <>
            <Heading>Administración de Usuarios</Heading>

            <p className="text-center text-gray-500 mt-10">No hay usuarios disponibles.</p>
        </>
    )

    if(page > totalPages) return <Navigate to={`/admin/dashboard/users?page=${totalPages}`} replace />
    
    return (
        <>
            <Heading>Panel de Administración de Usuarios</Heading>

            <p className="text-center text-gray-500 mt-10">Listado de usuarios confirmados.</p>

            <SearchBar
                route="admin/dashboard/users"
                param="searchUser"
                inputType="text"
                formText="Buscar por RUT o Correo"
                searchText="Usuario"
            />

            <AdminConfirmedTable 
                type="confirmed"
                users={users} 
                isLoading={isLoading} 
                error={error} 
            />  {/* Pass the required props to the table */}

            <UsersPagination
                route="dashboard/users"
                page={page}
                totalPages={totalPages}
            />
        </>
    );
}
