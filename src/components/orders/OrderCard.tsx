import { changeOrderStatus } from "@/api/OrderAPI";
import { AdminCheckoutForm, CheckoutForm } from "@/types/index"
import { copyToClipboard } from "@/utilities/copy";
import { formatPhone } from "@/utilities/phone";
import { formatToCLP } from "@/utilities/price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Package, CreditCard, MapPin, Phone, Mail, User } from "lucide-react"
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import OrderDetailsModal from "./OrderDetailsModal";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "../ui/Loader";

type OrderCardProps = {
    order: CheckoutForm | AdminCheckoutForm
    admin: boolean
}

export default function OrderCard({ order, admin } : OrderCardProps) {
    const { data, isError, isLoading } = useAuth();
    const navigate = useNavigate();
	const location = useLocation();

	// Get the 'orderDetails' query param from the URL
	const queryParams = new URLSearchParams(location.search);
	const orderDetails = queryParams.get("orderDetails");

	// Handle click on "Ver Detalles"
	const handleClick = () => {
		const params = new URLSearchParams(location.search);
		params.set("orderDetails", order.id.toString() || ""); // Set the product code

		navigate(`${location.pathname}?${params.toString()}`); // Navigate with the updated URL
	};

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: changeOrderStatus, 
        onError: (error) => {
            toast.error(error.message)
        }, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Orden Actualizada Correctamente")
        }
    })

    const handleStatusOrder = (orderId: number, active: number) => {

        const message = active === 0 ? "¿Deseas Marcar la Orden como Completada? ✅" : "¿Deseas Marcar la Orden como Cancelada? ❌";
        Swal.fire({
            title: `${message}`,
            text: "Puedes deshacer esta acción cuando quieras. ⚡",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Marcar como " + (active === 0 ? "Completada" : "Cancelada"),
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if(result.isConfirmed) {
                const changeData = { orderId, active };
                mutate(changeData);
            }
        })
    }

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

    const customDiscount = ((data?.discount || 20) / 100) // Discount in decimal
    //console.log(discount)

    const orderStatus = order.active === 1 ? false : true;
    //console.log(orderStatus)

    // Calculate order total with discount support
    const subtotalWithoutDiscounts = order.cartDetails.reduce(
        (sum, item) => sum + (item.cd_unit_value * item.quantity), 0);
    
    const totalDiscount = order.cartDetails.reduce((sum, item) => 
        sum + ((item.cd_unit_value * customDiscount) * item.quantity), 0);

    const totalItems = order.cartDetails.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = subtotalWithoutDiscounts - totalDiscount;
    
    const iva = Math.round(subtotalWithoutDiscounts * 0.19); // 19% IVA in Chile
    const total = subtotal + iva;

    // Check if any items have discounts
    const hasAnyDiscount = order.cartDetails.some(item => (item.cd_discount || item.discount || 0) > 0);

    if(isLoading) return <Loader />;

    if(isError) return <Navigate to="/auth/login" replace />;

    if(data) return (
        <>
            <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-400 to-red-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <h2 
                            className="text-xl font-bold truncate max-w-[200px] overflow-hidden whitespace-nowrap"
                            onClick={() => copyToClipboard(order.token)}
                        >
                            Tóken{" "}
                            <span className="hover:cursor-pointer hover:underline hover:text-yellow-500 transition-colors">
                                #{order.documentToken}
                            </span>
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
                            <span>{order.clientPhone ? formatPhone(order.clientPhone) : "N/A"}</span>
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
                        {/* Subtotal before discounts */}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                            <span>{formatToCLP(subtotalWithoutDiscounts)}</span>
                        </div>

                        {/* Discounts */}
                        {hasAnyDiscount && (
                            <div className="flex justify-between">
                            <span className="text-gray-600">Descuentos aplicados</span>
                            <span className="text-green-600 font-semibold bg-green-100 rounded px-2">- {formatToCLP(totalDiscount)}</span>
                            </div>
                        )}

                        {/* Subtotal after discounts */}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal (con descuento)</span>
                            <span>{formatToCLP(subtotal)}</span>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Envío</span>
                            <span className={`${order.shippingCost === 0 ? "text-green-500 font-bold" : "text-orange-500 font-bold"}`}>
                            {order.shippingCost === 0 ? "Gratis" : formatToCLP(order.shippingCost)}
                            </span>
                        </div>

                        {/* IVA */}
                        <div className="flex justify-between">
                            <span className="text-gray-600">IVA (19%)</span>
                            <span>{formatToCLP(iva)}</span>
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                            <span>Total a Pagar</span>
                            <span className="text-orange-700">{formatToCLP(total)}</span>
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
                        <div>
                            {admin && (
                                <>
                                    {orderStatus ? (
                                        <>
                                            <button
                                                onClick={() => handleStatusOrder(order.id, 1)}
                                                className={`mt-3 block w-full text-center font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                                    ${orderStatus ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}
                                                `}
                                            >
                                                Marcar Orden como Pendiente
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleStatusOrder(order.id, 0)}
                                                className={`mt-3 block w-full text-center font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                                    ${!orderStatus ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}
                                                `}
                                            >
                                                Marcar Orden como Completada
                                            </button>
                                        </>
                                    )}
                                </>
                            )}

                            {order.url ? (
                                <button onClick={handleClick} className="mt-3 block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors">
                                    Ver Detalles de la Orden
                                </button>
                            ) : (
                                <p className="text-gray-500 text-sm mt-2">No URL disponible</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {orderDetails === (order.id).toString() && (
                <OrderDetailsModal
                    order={order}
                    admin={admin}
                />
            )}
        </>
    );
}