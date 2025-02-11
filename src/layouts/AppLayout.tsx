import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "../components/ui/Logo";
import NavMenu from "../components/ui/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth();

    if(isLoading) return <Loader />;

    if(isError) return <Navigate to="/auth/login" replace />;

    if(data) return (
        <>
            <header className="bg-orange-500 shadow-lg">
                <div className="max-w-screen-2xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Logo */}
                        <Link to={"/"}>
                        <Logo />
                        </Link>

                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white hidden md:block ">Bienvenido a Portal Spare Parts Trade</h1>
                    </div>
                    

                    <div>
                        <NavMenu 
                            name={data.name}
                        />
                    </div>
                </div>

                <nav>
                    <div className="mx-auto flex flex-col md:flex-row items-center justify-between bg-slate-800 w-full p-5 mt-10 md:mt-0">
                        <div className="flex items-center space-x-4">
                            <Link to={'/'} className="text-white font-bold hover:underline">Inicio</Link>
                            <Link to={'/orders'} className="text-white font-bold hover:underline">Ordenes Registradas</Link>
                            <Link to={'/'} className="text-white font-bold hover:underline">Carrito</Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="max-w-screen-2xl mx-auto mt-8 p-5">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-800 py-4 mt-12">
                <div className="max-w-screen-2xl mx-auto text-center text-white">
                <p className="text-sm">
                    Todos los derechos reservados Spare Parts Trade &copy;{" "}
                    <span className="font-bold">{new Date().getFullYear()}</span>
                </p>
                </div>
            </footer>

            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
        </>
    );
}
