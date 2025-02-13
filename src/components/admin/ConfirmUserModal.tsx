import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { confirmUser, getUserById } from '@/api/AdminAPI';
import { toast } from 'react-toastify';
import Loader from '../ui/Loader';
import { XMarkIcon } from '@heroicons/react/20/solid';

export default function ConfirmUserModal() {
    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(location.search);
    const confirmUserId = queryParams.get('confirmUser')!;

    const show = confirmUserId ? true : false

    const { handleSubmit } = useForm({})

    const queryClient = useQueryClient();

    // Obtener usuario con useQuery
    const { data, isLoading, error } = useQuery({
        queryKey: ["user", confirmUserId],
        queryFn: () => getUserById({ userId: confirmUserId }),
        enabled: !!confirmUserId,  // Esto asegura que no se ejecute si no hay confirmUserId
    });

    const user = data?.user;

    const { mutate } = useMutation({
        mutationFn: confirmUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            // "delete" unconfirmed user from query cache
            queryClient.invalidateQueries({ queryKey: ["unconfirmedUsers"] });
            toast.success(data.message)
        }
    })

    const handleForm = async () => {
        mutate({ userId:  confirmUserId });
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">

                                {/* Botón de cierre */}
                                <button 
                                    onClick={() => navigate(location.pathname, { replace: true })}
                                    className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 transition"
                                >
                                    <XMarkIcon className="h-8 w-8" />
                                </button>


                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >Confirmar Usuario</Dialog.Title>

                                <p className="text-xl font-bold">Una vez confirmado el usuario será enviado un email con las instrucciones para {''}
                                    <span className="text-orange-600">establecer su contraseña</span>
                                </p>

                                {isLoading && <Loader />}
                                {error && <p className="text-red-600">Error al obtener usuario.</p>}

                                {user && (
                                    <div className="mt-5 p-5 border border-gray-300 rounded-lg bg-gray-50">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <tbody>
                                                <tr className="">
                                                    <td className="p-2 font-bold">👨‍💼 Nombre:</td>
                                                    <td className="p-2">{user.name}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="p-2 font-bold">🏢 Empresa:</td>
                                                    <td className="p-2">{user.businessName}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="p-2 font-bold">🪪 RUT Personal:</td>
                                                    <td className="p-2">{user.rut}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="p-2 font-bold">🆔 RUT Empresa:</td>
                                                    <td className="p-2">{user.businessRut}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="p-2 font-bold">📍 Dirección:</td>
                                                    <td className="p-2">{user.address}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="p-2 font-bold">📞 Teléfono:</td>
                                                    <td className="p-2">{user.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2 font-bold">📧 Correo:</td>
                                                    <td className="p-2">{user.email}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <form className="mt-10 space-y-5 border-t border-gray-300 pt-10" onSubmit={handleSubmit(handleForm)} noValidate>
                                    <input
                                        type="submit"
                                        className="bg-orange-500 hover:bg-orange-600 w-full p-3 text-white font-black text-xl cursor-pointer rounded transition-colors"
                                        value="Autorizar Usuario"
                                    />
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}