import AdminSidebar from '@/components/admin/AdminSidebar'
import Footer from '@/components/ui/Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AdminLayout() {
    return (
        <>
            <div className="md:flex min-h-screen overflow-auto sm:overflow-hidden">
                <aside className="md:w-72 bg-orange-500 md:sticky md:top-0 md:h-screen border-r-4 border-slate-800">
                    <AdminSidebar />
                </aside>

                <div className="flex-1">
                    <Outlet />

                    {/** <Footer />*/}
                </div>
            </div>

            <Footer />

            <ToastContainer
                position="top-right"
                autoClose={4000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
        </>
    )
}
