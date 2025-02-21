import { useCart } from "@/hooks/useCart"
import { CartDetailData } from "@/types/index"
import { formatToCLP } from "@/utilities/price"
import { capitalizeFirstLetter } from "@/utilities/text"
import { useQueryClient } from "@tanstack/react-query"
import { updateCart } from "@/api/ProductAPI"
import { useState } from "react"

type CartTableProps = {
    cartDetails: CartDetailData[]
}

export default function CartTable({cartDetails}: CartTableProps) {
    const { cartId, fetchCartDetails, addItemToCart, deleteItemFromCart, clearCart } = useCart();
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});

    const handleDeleteItem = (detailId: number) => {
        deleteItemFromCart(detailId);
        queryClient.invalidateQueries({ queryKey: ["cartDetails", cartId] });
    }

    const handleUpdateQuantity = async (item: CartDetailData, newQuantity: number) => {
        if (!cartId || newQuantity < 1 || isUpdating[item.id]) return;

        try {
            setIsUpdating(prev => ({ ...prev, [item.id]: true }));
            
            // Prepare the update payload according to your API structure
            const updatePayload = {
                cartDetails: [
                    {
                        id: item.id,
                        quantity: newQuantity,
                        unitValue: item.unitValue,
                        image: item.cd_image || item.image,
                        idVarianteProducto: item.id_variante_producto,
                        itemName: item.itemName,
                        productWebId: item.productWebId,
                        discount: item.cd_discount || item.discount || 0
                    }
                ]
            };

            // Call the API update function
            await updateCart({ formData: updatePayload, cartId });
            
            // Refresh the cart data
            queryClient.invalidateQueries({ queryKey: ["cartDetails", cartId] });
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
        } finally {
            setIsUpdating(prev => ({ ...prev, [item.id]: false }));
        }
    };

    // Calculate order total
    const subtotal = cartDetails.reduce((sum, item) => sum + item.cd_sub_total, 0);
    const iva = Math.round(subtotal * 0.19); // 19% IVA in Chile
    const total = subtotal + iva;

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-10">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Precio Unidad
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Cantidad
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Subtotal
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cartDetails.map((item: CartDetailData) => (
                                    <tr key={item.id}>
                                        <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 mr-3">
                                                    <img 
                                                        src={item.image || item.cd_image} 
                                                        alt={item.itemName} 
                                                        className="h-full w-full object-contain object-center"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-2 overflow-hidden text-ellipsis max-w-[200px]">
                                                    {capitalizeFirstLetter(item.itemName)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {formatToCLP(item.cd_unit_value)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 overflow-hidden text-ellipsis max-w-[200px]">
                                            {formatToCLP(item.cd_sub_total)}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <div className="flex items-center justify-end space-x-3">
                                                <div className="flex items-center border rounded">
                                                    <button 
                                                        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || isUpdating[item.id]}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center">
                                                        {isUpdating[item.id] ? 
                                                            <span className="inline-block w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></span> : 
                                                            item.quantity
                                                        }
                                                    </span>
                                                    <button 
                                                        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        disabled={isUpdating[item.id]}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button 
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    disabled={isUpdating[item.id]}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Order total row */}
                                {cartDetails.length > 0 && (
                                    <>
                                        <tr className="bg-gray-50">
                                            <td colSpan={3} className="py-4 pl-4 pr-3 text-right font-medium text-gray-900 sm:pl-0">
                                                Subtotal:
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                {formatToCLP(subtotal)}
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <td colSpan={3} className="py-2 pl-4 pr-3 text-right font-medium text-gray-900 sm:pl-0">
                                                IVA (19%):
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900">
                                                {formatToCLP(iva)}
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <td colSpan={3} className="py-4 pl-4 pr-3 text-right font-semibold text-gray-900 sm:pl-0 text-base">
                                                Total a pagar:
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 font-bold text-lg text-gray-900">
                                                {formatToCLP(total)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}