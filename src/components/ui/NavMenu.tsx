import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition
} from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/index';

type NavMenuProps = {
    name: User["name"];
}

export default function NavMenu ({name} : NavMenuProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('SPT_ADMIN_TOKEN');
        localStorage.removeItem('SPT_AUTH_TOKEN');
        queryClient.removeQueries();
        navigate('/auth/login');
    };

    // Evitar el overflow-x en móviles cuando el menú está abierto
    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add("overflow-x-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [menuOpen]);

    return (
        <Popover className='relative'>
            <PopoverButton
                onClick={() => setMenuOpen(!menuOpen)} 
                className='inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-slate-800'
            >
            <Bars3Icon className='w-8 h-8 text-white ' />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <PopoverPanel 
                    className='absolute left-1/2 z-10 mt-5 flex w-screen md:w-72 md:-translate-x-66 lg:w-92 -translate-x-1/2 lg:-translate-x-87'
                >
                    <div className='w-full lg:w-92 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5'>
                        <p className='text-center border-b-gray-300 border-b-2 p-3 font-bold'>Bienvenido: {''}
                            <span className='text-slate-800 font-extrabold'>{name}</span>
                        </p>
                        <Link
                            to='/profile'
                            className='block p-2 hover:text-purple-950'
                        >
                            Mi Perfil
                        </Link>
                        <Link
                            to='/orders'
                            className='block p-2 hover:text-purple-950'
                        >
                            Mis Ordenes
                        </Link>
                        <button
                            className='block p-2 text-red-500 hover:text-purple-950'
                            type='button'
                            onClick={logout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}