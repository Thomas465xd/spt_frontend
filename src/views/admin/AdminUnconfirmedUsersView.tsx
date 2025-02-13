import { getUnconfirmedUsers } from "@/api/AdminAPI";
import AdminConfirmedTable from "@/components/admin/AdminConfirmedTable";
import UsersPagination from "@/components/admin/UsersPagination";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useSearchParams } from "react-router-dom";

export default function AdminUnconfirmedUsersView() {
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    if(page < 1) return <Navigate to={`/admin/confirm?page=1`} replace />

    const itemsPerPage = 5; 

    const { data, isLoading, error } = useQuery({
        queryKey: ['unconfirmedUsers', page], // Ensure 'page' is passed as part of the queryKey
        queryFn: () => getUnconfirmedUsers({ page, perPage: itemsPerPage }), // Send page and perPage to the API
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const users = data?.users || [];
    const totalUsers = data?.totalUsers || 0; // Assuming totalUsers is returned from the API

    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    if(isLoading) return <Loader />

    if(totalPages === 0 && page > totalPages) return (
        <>
            <Heading>Administración de usuarios no Confirmados</Heading>

            <p className="text-center text-gray-500 mt-10">No hay usuarios disponibles.</p>
        </>
    )

    if(page > totalPages) return <Navigate to={`/admin/confirm?page=${totalPages}`} replace />
    
    return (
        <>
            <Heading>Administración de usuarios no Confirmados</Heading>

            {/** To do: Search Bar */}

            <AdminConfirmedTable 
                type="unconfirmed"
                users={users} 
                isLoading={isLoading} 
                error={error} 
            />  {/* Pass the required props to the table */}

            <UsersPagination
                route="confirm"
                page={page}
                totalPages={totalPages}
            />
        </>
    );
}
