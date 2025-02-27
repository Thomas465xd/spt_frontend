import AdminSidebar from '@/components/admin/AdminSidebar'
import Footer from '@/components/ui/Footer'
import Loader from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AdminLayout() {

    const { data, isError, isLoading } = useAuth();

    if(isLoading) return <Loader />;

    if(isError) return <Navigate to="/auth/login" replace />;

    if(!data?.admin) return <Navigate to="/" replace />;

    return (
        <>
            <div className="md:flex min-h-screen overflow-auto sm:overflow-hidden">
                <aside className="md:w-72 bg-gradient-to-r from-orange-600 to-orange-400 md:sticky md:top-0 md:h-screen overflow-y-auto border-r-4 border-slate-800">
                    <AdminSidebar />
                </aside>

                <div className="flex-1 flex flex-col md:max-h-screen md:overflow-auto">
                    <div className='flex-1'>   
                        <Outlet />
                    </div>

                    <div className=''>
                        <Footer />
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={4000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
        </>
    )
}
