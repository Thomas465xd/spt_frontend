import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CopyIcon, PackageIcon, TruckIcon, UserIcon, MapPinIcon, CreditCardIcon, ReceiptIcon } from 'lucide-react';
import { AdminCheckoutForm, CheckoutForm } from '@/types/index';
import { copyToClipboard } from '@/utilities/copy';
import { formatToCLP } from '@/utilities/price';

type OrderDetailsModalProps = {
    order: CheckoutForm | AdminCheckoutForm
    admin: Boolean
}

export default function OrderDetailsModal({ order, admin }: OrderDetailsModalProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const yourParam = queryParams.get('orderDetails')!;
    const show = yourParam ? true : false;

    // Close handler to remove 'orderDetails' parameter from URL
    const handleClose = () => {
        queryParams.delete("orderDetails");
        navigate(`${location.pathname}?${queryParams.toString()}`, {
            replace: true,
        });
    };

    // Format date from Unix timestamp (seconds since epoch)
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "N/A";
        // Convert Unix timestamp (seconds) to milliseconds for JavaScript Date
        const date = new Date(timestamp * 1000);
        
        // Format as: Month Day, Year (e.g., "February 26, 2025")
        return date.toLocaleDateString("es-ES", {
            year: 'numeric',
            month: 'long',
            day: 'numeric', 
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    // Calculate order total
	const subtotal = order.cartDetails.reduce(
		(sum, item) => sum + item.cd_sub_total,
		0
	);
	const iva = Math.round(subtotal * 0.19); // 19% IVA in Chile
	const total = subtotal + iva;

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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8">
                                {/* Close button */}
                                <button 
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                                >
                                    <XMarkIcon className="h-8 w-8" />
                                </button>
                                
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-3xl my-4 text-gray-900"
                                >
                                    Resumen de la Orden
                                </Dialog.Title>

                                <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-bold text-orange-800">
                                                Orden #{order.id}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(order.createAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white rounded-md px-3 py-2 border border-orange-200">
                                            <p className="text-sm font-medium text-gray-700">Token: </p>
                                            <p className="text-sm font-mono">{order.token}</p>
                                            <button 
                                                onClick={() => copyToClipboard(order.token)}
                                                className="text-orange-600 hover:text-orange-800 transition"
                                            >
                                                <CopyIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-xl mb-4 flex items-center">
                                        <PackageIcon className="mr-2 h-5 w-5 text-orange-600" />
                                        Productos
                                    </h4>
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Producto
                                                        </th>
                                                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Cantidad
                                                        </th>
                                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Precio Unitario
                                                        </th>
                                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {order.cartDetails.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-12 w-12 flex-shrink-0 mr-4">
                                                                        <img 
                                                                            className="h-12 w-12 rounded-md object-cover border border-gray-200" 
                                                                            src={item.image || item.cd_image} 
                                                                            alt={item.itemName} 
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{item.itemName}</p>
                                                                        <p className="text-xs text-gray-500">SKU: {item.sku || item.codigo_variante_producto}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                                {item.quantity || item.cd_q}
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                                 {formatToCLP(item.unitValue || item.cd_unit_value)}
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                                 {formatToCLP(item.total || item.cd_sub_total)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary and Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="font-bold text-xl mb-4 flex items-center">
                                            <UserIcon className="mr-2 h-5 w-5 text-orange-600" />
                                            Información del Cliente
                                        </h4>
                                        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Nombre</p>
                                                <p className="text-base">{order.clientName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-base">{order.clientEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                                <p className="text-base">{order.clientPhone}</p>
                                            </div>
                                            
                                            <div className="pt-2 border-t border-gray-100">
                                                <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                                    <MapPinIcon className="mr-1 h-4 w-4 text-orange-600" />
                                                    Dirección de Envío
                                                </p>
                                                <p className="text-sm">
                                                    {order.clientStreet} {order.clientBuildingNumber}<br />
                                                    {order.clientCityZone}, {order.clientState}<br />
                                                    {order.clientPostcode}, {order.clientCountry}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div>
                                        <h4 className="font-bold text-xl mb-4 flex items-center">
                                            <ReceiptIcon className="mr-2 h-5 w-5 text-orange-600" />
                                            Resumen de Pago
                                        </h4>
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Subtotal:</span>
                                                    <span> {order.totalCart ? formatToCLP(order.totalCart) : "N/A"}</span>
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Impuestos:</span>
                                                    <span> {formatToCLP(iva)}</span>
                                                </div>
                                                
                                                {order.discountCost != null && order.discountCost > 0 && (
                                                    <div className="flex justify-between text-sm text-green-600">
                                                        <span>Descuento:</span>
                                                        <span>- {formatToCLP(order.discountCost ?? 0)}</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Costo de envío:</span>
                                                    <span> {formatToCLP(order.shippingCost)}</span>
                                                </div>
                                                
                                                
                                                <div className="pt-2 mt-2 border-t border-gray-200">
                                                    <div className="flex justify-between font-bold text-lg">
                                                        <span>Total:</span>
                                                        <span className="text-orange-600"> {formatToCLP(total)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 flex items-center">
                                                        <CreditCardIcon className="mr-1 h-4 w-4 text-orange-600" />
                                                        Método de Pago
                                                    </p>
                                                    <p className="text-base">{order.payProcess === "for_validate" && "N/A"}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 flex items-center">
                                                        <TruckIcon className="mr-1 h-4 w-4 text-orange-600" />
                                                        Método de Entrega
                                                    </p>
                                                    <p className="text-base">
                                                        {order.withdrawStore === 1 
                                                            ? `Retiro en Tienda: ${order.pickName} (${order.pickCode})`
                                                            : 'Envío a domicilio'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="mt-8 flex justify-between">
                                    <button 
                                        onClick={handleClose}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        disabled={true}
                                        rel="noopener noreferrer"
                                        className="px-14 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition opacity-50"
                                    >
                                        {admin ? "Cambiar Estado de Pago" : "Pagar Ahora"}
                                    </button>
                                </div>
                                <p className='text-gray-400 flex justify-end text-sm'>Esta función no esta disponible <br/> actualmente</p>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}