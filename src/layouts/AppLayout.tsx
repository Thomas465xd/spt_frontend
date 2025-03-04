import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "../components/ui/Logo";
import NavMenu from "../components/ui/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import Footer from "@/components/ui/Footer";
import { ShoppingCart, Home, Boxes, ClipboardList, User } from "lucide-react";

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth();

    if (isLoading) return <Loader />;
    if (isError) return <Navigate to="/auth/login" replace />;

    if (data) return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-600 to-orange-400 shadow-lg">
                <div className="max-w-screen-2xl mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to={"/"} className="transform hover:scale-101 transition-transform duration-200">
                            <Logo />
                        </Link>
                    </div>

                    <div className="mt-2 md:mt-0">
                        <h1 className="text-xl md:text-2xl font-bold text-white text-center md:text-left drop-shadow-sm">
                            Bienvenido a Portal Spare Parts Trade
                        </h1>
                    </div>

                    <div className="mt-3 md:mt-0">
                        <NavMenu name={data.name} />
                    </div>
                </div>

                <nav>
                    <div className="mx-auto flex flex-wrap justify-center md:justify-between bg-slate-800 w-full p-4 mt-4 md:mt-0 shadow-inner">
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                            <Link to={'/'} className="text-white font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700">
                                <Home size={18} />
                                <span>Inicio</span>
                            </Link>
                            {/*
                            <Link to={'/categories'} className="text-white font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700">
                                <Tag size={18} />
                                <span>Categorías</span>
                            </Link>
                            */}
                            <Link to={'/profile'} className="text-white font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700">
                                <User size={18} />
                                <span>Perfil</span>
                            </Link>
                            <Link to={'/products'} className="text-white font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700">
                                <Boxes size={18} />
                                <span>Productos</span>
                            </Link>
                            <Link to={'/cart'} className="text-white font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700">
                                <ShoppingCart size={18} />
                                <span>Carrito</span>
                            </Link>
                            <Link to={'/orders'} className="text-white font-medium hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700">
                                <ClipboardList size={18} />
                                <span>Ordenes</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-screen-2xl md:mx-10 lg:mx-30 xl:mx-auto mt-8 p-5">
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