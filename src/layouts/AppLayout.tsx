import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "../components/ui/Logo";
import NavMenu from "../components/ui/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import Footer from "@/components/ui/Footer";

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth();

    if (isLoading) return <Loader />;
    if (isError) return <Navigate to="/auth/login" replace />;

    if (data) return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-orange-500 shadow-lg">
                <div className="max-w-screen-2xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to={"/"}>
                            <Logo />
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white hidden md:block">
                            Bienvenido a Portal Spare Parts Trade
                        </h1>
                    </div>

                    <div>
                        <NavMenu name={data.name} />
                    </div>
                </div>

                <nav>
                    <div className="mx-auto flex flex-col md:flex-row items-center justify-between bg-slate-800 w-full p-5 mt-10 md:mt-0">
                        <div className="flex items-center space-x-4">
                            <Link to={'/'} className="text-white font-bold hover:underline">Inicio</Link>
                            <Link to={'/products'} className="text-white font-bold hover:underline">Productos</Link>
                            <Link to={'/orders'} className="text-white font-bold hover:underline">Ordenes Registradas</Link>
                            <Link to={'/cart'} className="text-white font-bold hover:underline">Carrito</Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-screen-2xl mx-auto mt-8 p-5">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="mt-auto">
                <Footer />
            </footer>

            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
        </div>
    );
}

