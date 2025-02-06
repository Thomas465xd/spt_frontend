import Logo from "../ui/Logo"
import AdminRoute from "./AdminRoute"

const adminNavigation = [
    {url: '/admin/dashboard', text: 'Usuarios', blank: false},
    {url: '/admin/confirm', text: "Autorizar", blank: false},
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
                <p className="sm:mt-0 lg:mt-10 xl:mt-20 2xl:mt-32 uppercase font-bold text-sm text-white text-center">Navegación de Administrador</p>
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