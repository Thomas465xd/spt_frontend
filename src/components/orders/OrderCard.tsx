import { CheckoutForm } from "@/types/index"
import { copyToClipboard } from "@/utilities/copy";
import { formatPhone } from "@/utilities/phone";
import { formatToCLP } from "@/utilities/price";
import { CalendarDays, Package, CreditCard, MapPin, Phone, Mail, User } from "lucide-react"
import { Link } from "react-router-dom";

type OrderCardProps = {
    order: CheckoutForm
}

export default function OrderCard({ order }: OrderCardProps) {
    // Format date from Unix timestamp (seconds since epoch)
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "N/A";
        // Convert Unix timestamp (seconds) to milliseconds for JavaScript Date
        const date = new Date(timestamp * 1000);
        
        // Format as: Month Day, Year (e.g., "February 26, 2025")
        return date.toLocaleDateString("es-ES", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4 text-white">
                <div className="flex justify-between items-center">
                    <h2 
                        className="text-xl font-bold truncate max-w-[200px]"
                        onClick={() => copyToClipboard(order.token)}
                    >
                        Tóken <span className="hover:cursor-pointer hover:underline hover:text-yellow-500 transition-colors">#{order.documentToken}</span>
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.active ? "bg-yellow-500" : "bg-green-500"
                    }`}>
                        {order.active ? "Pendiente" : "Completada"}
                    </span>
                </div>
                <div className="flex items-center mt-1 text-sm">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {formatDate(order.createAt)}
                </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Método de Pago</h3>
                        <div className="flex items-center mt-1">
                            <CreditCard className={`w-4 h-4 mr-2 text-gray-400`} />
                            <span className={`font-medium ${order.payProcess === "for_validate" ? "text-yellow-500" : "text-green-500" }`}>{order.payProcess === "for_validate" ? "Pendiente" : "Pagado"}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Razón Social</h3>
                        <span className="font-medium">{order.extrasUserData?.razon_social}</span>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Datos del Cliente</h3>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{order.clientName}</span>
                    </div>
                    <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{order.clientEmail}</span>
                    </div>
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatPhone(order.clientPhone)}</span>
                    </div>
                    <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                        <div className="text-sm">
                            <p className="font-medium">{order.clientStreet} {order.clientBuildingNumber} {order.extrasUserData?.comuna}</p>
                            <p>{order.clientCityZone}, {order.clientState} {order.clientPostcode}</p>
                            <p>{order.clientCountry}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Summary */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Resúmen de la Orden</h3>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Items ({order.cartDetails?.length || 0})</span>
                        <span>{formatToCLP(order.totalCart)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Envío</span>
                        <span className={`${order.shippingCost === 0 ? "text-green-500 font-bold" : "text-orange-500 font-bold"}`}>
                            {order.shippingCost === 0 ? "Gratis" : formatToCLP(order.shippingCost)}
                        </span>
                    </div>
                    {order.discountCost > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Descuento</span>
                            <span className="text-green-600">-{formatToCLP(order.discountCost)}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-orange-700">{formatToCLP(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pickup Information */}
            <div className="p-4 bg-gray-50">
                <div className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-orange-600" />
                    <div>
                        <h3 className="text-sm font-medium">{order.pickStoreId === 1 ? (
                            "Retiro en Sucursal"
                        ) : (
                            "Despacho a Domicilio"
                        )}</h3>
                        <p className="text-sm text-gray-500">{order.pickName} (RUT: {order.pickCode})</p>
                    </div>
                </div>

                {order.url && (
                    <Link
                        to=""
                        className="mt-3 block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                        Ver Detalles de la Orden
                    </Link>
                )}
            </div>
        </div>
    );
}