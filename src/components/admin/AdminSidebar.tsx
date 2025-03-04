import { useQueryClient } from "@tanstack/react-query";
import Logo from "../ui/Logo"
import AdminRoute from "./AdminRoute"
import { useNavigate } from "react-router-dom";

const adminNavigation = [
    {url: '/admin/dashboard', text: 'Inicio', blank: false},
    {url: '/admin/users', text: 'Usuarios', blank: false},
    {url: '/admin/confirm', text: "Autorizar", blank: false},
    {url: '/admin/orders', text: 'Ordenes', blank: false},
    {url: '/', text: 'Ir al Portal', blank: true},
]

export default function AdminSidebar() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('SPT_ADMIN_TOKEN');
        localStorage.removeItem('SPT_AUTH_TOKEN');
        queryClient.removeQueries();
        navigate('/auth/login');
    };

    return (
        <>
            <div className="flex justify-center">
                <Logo />
            </div>
            <div className="space-y-3 ">
                <p className="sm:mt-0 lg:mt-0 xl:mt-20 2xl:mt-32 uppercase font-bold text-sm text-white text-center">Navegación de Administrador</p>
                <nav className="flex flex-col">
                    {adminNavigation.map((link) => (
                        <AdminRoute
                            key={link.url}
                            link={link}
                        />
                    ))}
                    <button
                        className='text-white font-bold text-lg border-t border-gray-200 bg-slate-800 hover:bg-slate-900 p-3 last:border-b'
                        type='button'
                        onClick={logout}
                    >
                        Cerrar Sesión
                    </button>
                </nav>
            </div>
        </>

    )
}