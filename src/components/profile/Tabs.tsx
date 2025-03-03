import { FingerPrintIcon, TruckIcon, UserIcon } from '@heroicons/react/20/solid'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
    { name: 'Mi Perfil', href: '/profile', icon: UserIcon },
    { name: 'Información de Envío', href: '/profile/shipping', icon: TruckIcon },
    { name: 'Cambiar Contraseña', href: '/profile/password', icon: FingerPrintIcon },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentTab = tabs.filter(tab => tab.href === location.pathname)[0].href
    
    return (
        <div className='mb-10'>
            <div className="hidden">
                <label htmlFor="tabs" className="sr-only">
                    Selecciona una pestaña
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-orange-800 focus:ring-orange-800"
                    onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => navigate(e.target.value) }
                    value={currentTab}
                >
                    {tabs.map((tab) => {
                        return (
                            <option 
                                value={tab.href}
                                key={tab.name}>{tab.name}
                            </option>
                        )
                    })}
                </select>
            </div>

            <div className="sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.name}
                                to={tab.href}
                                className={classNames(
                                    location.pathname === tab.href
                                        ? 'border-orange-800 text-orange-800'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                                )}
                            >
                                <tab.icon
                                    className={classNames(
                                        location.pathname === tab.href ? 'text-orange-800' : 'text-gray-400 group-hover:text-gray-500',
                                        '-ml-0.5 mr-2 h-5 w-5'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}