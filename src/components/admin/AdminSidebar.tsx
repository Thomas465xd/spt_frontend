import Logo from "../ui/Logo"
import AdminRoute from "./AdminRoute"

const adminNavigation = [
    {url: '/admin', text: 'Usuarios', blank: false},
    {url: '/admin/products', text: 'Productos', blank: false},
    {url: '/', text: 'Ir al Portal', blank: true},
]

export default function AdminSidebar() {

    return (
        <>
            <div className="flex justify-center">
                <Logo />
            </div>
            <div className="space-y-3 ">
                <p className="mt-10 uppercase font-bold text-sm text-white text-center">Navegación de Administrador</p>
                <nav className="flex flex-col">
                    {adminNavigation.map((link) => (
                        <AdminRoute
                            key={link.url}
                            link={link}
                        />
                    ))}
                </nav>
            </div>
        </>

    )
}