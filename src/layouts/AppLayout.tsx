import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "../components/ui/Logo";
import NavMenu from "../components/ui/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/ui/Footer";
import { ShoppingCart, Home, Boxes, ClipboardList, User, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import HomeLoader from "@/components/ui/HomeLoader";
import Swal from "sweetalert2";

export default function AppLayout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data, isError, isLoading } = useAuth();
    const location = useLocation(); 

    const currentPath = location.pathname; 
    console.log(currentPath)

    const logout = () => {
        localStorage.removeItem('SPT_ADMIN_TOKEN');
        localStorage.removeItem('SPT_AUTH_TOKEN');
        queryClient.removeQueries();
        navigate('/auth/login');
    };

    const handleLogout = () => {
        Swal.fire({
            title: "¿Estas seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Cerrar Sesión",
            cancelButtonText: "Volver",
        }).then((result) => {
            if(result.isConfirmed) {
                logout()
            }
        });
    }

    if (isLoading) return <HomeLoader />;
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
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 ">
                            <Link 
                                to={'/'} 
                                className={`group font-medium ${currentPath == "/" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
                            >
                                <Home size={18} className="group-hover:-translate-y-0.5 transition-all duration-500" />
                                <span>Inicio</span>
                            </Link>
                            <Link 
                                to={'/profile'} 
                                className={`group font-medium ${currentPath == "/profile" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
                            >
                                <User size={18} className="group-hover:-translate-y-0.5 transition-all duration-500" />
                                <span>Perfil</span>
                            </Link>
                            <Link 
                                to={'/products'} 
                                className={`group font-medium ${currentPath == "/products" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
                            >
                                <Boxes size={18} className="group-hover:-translate-y-0.5 transition-all duration-500" />
                                <span>Productos</span>
                            </Link>
                            <Link 
                                to={'/cart'} 
                                className={`group font-medium ${currentPath == "/cart" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
                            >
                                <ShoppingCart size={18} className="group-hover:-translate-y-0.5 transition-all duration-500" />
                                <span>Carrito</span>
                            </Link>
                            <Link 
                                to={'/orders'} 
                                className={`group font-medium ${currentPath == "/orders" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
                            >
                                <ClipboardList size={18} className="group-hover:-translate-y-0.5 transition-all duration-500" />
                                <span>Ordenes</span>
                            </Link>
                        
                        </div>

                        <button
                            className='flex gap-2 p-2 font-medium text-red-400 hover:text-red-500 transition-colors duration-300'
                            type='button'
                            onClick={handleLogout}
                        >
                            <LogOut />
                            Cerrar Sesión
                        </button>
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