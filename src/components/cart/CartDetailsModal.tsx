import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Swal from 'sweetalert2';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import { CartDetailModal } from '@/types/index';

export default function ConfirmUserModal() {

    const location = useLocation()
    const navigate = useNavigate()

    const { cartId, fetchCartDetails, addItemToCart, deleteItemFromCart, clearCart } = useCart();
    const [cartDetails, setCartDetails] =  useState<CartDetailModal[]>([]);

    const queryParams = new URLSearchParams(location.search);
    const cartModal = queryParams.get('cart')!;
    const show = cartModal ? true : false

    const handleClose = () => {
		queryParams.delete("cart"); // Remove the productDetails param
		navigate(`${location.pathname}?${queryParams.toString()}`, {
			replace: true,
		}); // Update the URL
	};

    /*
    useEffect(() => {
        if (cartId) {
            fetchCartDetails().then((data) => {
                setCartDetails();
            });
        }
    }, [cartId]);
    */

    const handleReset = () => {
        Swal.fire({
            title: "¿Estas Seguro de esta Acción? ⚠️",
            text: "Al Reiniciar el Carrito se perderan todos los productos agregados",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart();
                queryParams.delete('cart');
                navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
            }
        })
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                                >
                                    <XMarkIcon className="h-8 w-8" />
                                </button>
                                
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-5 border-b border-gray-300 pb-3"
                                >Resúmen de Compra</Dialog.Title>

                                <p className="text-xl font-bold">Verifica que los productos ingresados sean correctos para {''}
                                    <span className="text-orange-600">proceder con la orden</span>
                                </p>

                                <div
                                    className="mt-10 space-y-5"
                                >

                                    <div className="flex gap-5">
                                        <button
                                            type="button"
                                            className=" bg-orange-600 hover:bg-orange-700 w-full rounded p-3 text-white font-black text-xl cursor-pointer transition-colors"
                                            onClick={() => navigate(location.pathname, { replace: true })}
                                        >
                                            Ir a Emitir Orden de Compra
                                        </button>

                                        <button
                                            type="button"
                                            className=" bg-slate-700 hover:bg-slate-700 w-full rounded p-3 text-white font-black text-xl cursor-pointer transition-colors"
                                            onClick={handleReset}
                                        >
                                            Borrar Carrito
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}