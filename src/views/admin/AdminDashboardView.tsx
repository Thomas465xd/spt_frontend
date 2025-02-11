import AdminConfirmedTable from "@/components/admin/AdminConfirmedTable"
import UsersPagination from "@/components/admin/UsersPagination";

export default function AdminDashboardView() {

    return (
        <>
            <h1 className="text-4xl font-bold text-center mt-10">Panel de Administración de Usuarios</h1>

            <AdminConfirmedTable />

            <UsersPagination />
        </>
    );
}
