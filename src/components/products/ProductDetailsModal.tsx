import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ProductWebType } from "@/types/index";
import { formatToCLP } from "@/utilities/price";
import { capitalizeFirstLetter } from "@/utilities/text";
import { useCart } from "@/hooks/useCart";

type ProductDetailsModalProps = {
	product: ProductWebType;
};

export default function ProductDetailsModal({
	product,
}: ProductDetailsModalProps) {
	const location = useLocation();
	const navigate = useNavigate();

    const { addItemToCart } = useCart();

	const queryParams = new URLSearchParams(location.search);
	const productDetails = queryParams.get("productDetails");
	const show = !!productDetails;


	// Close handler to remove 'productDetails' parameter from URL
	const handleClose = () => {
		queryParams.delete("productDetails"); // Remove the productDetails param
		navigate(`${location.pathname}?${queryParams.toString()}`, {
			replace: true,
		}); // Update the URL
	};

    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity((prev: number) => prev + 1);
    const handleDecrease = () => setQuantity((prev: number) => Math.max(1, prev - 1));

    const handleAddToCart = async () => {
        const discount =
        product.variants[0].discounts.length > 0 
            ? product.variants[0].discounts[0] // O usar reduce() si los descuentos se suman
            : 20; // Si no hay descuentos, asignar 0

        const formData = { cartDetails: [
                {
                    quantity: quantity,
                    unitValue: parseInt(basePrice),
                    image: product.urlImg,
                    idVarianteProducto: product.variants[0].id,
                    itemName: product.name, 
                    productWebId: product.productId,
                    discount: discount,
                }
            ] 
        };

        await addItemToCart(formData);
    }

    const basePrice = product.variants[0].salePrices.price ?? "N/A"; // Default value if salePrices is undefined
    const finalPrice = product.variants[0].salePrices.finalPrice ?? "N/A"; // Default value if salePrices is undefined

    const discount = product.variants[0].discounts.length > 0 ? product.variants[0].discounts[0] : 20;

	const hasStock = product.variants[0].stockInfo[0].quantityAvailable > 0;
    const totalStock = product.variants[0].stockInfo[0].quantityAvailable;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
    
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {/* Make the modal full height on mobile */}
                        <Dialog.Panel className="w-full max-w-4xl md:max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all 
                            h-full md:h-auto max-h-screen flex flex-col"
                        >
                            {/* Close Button (Now always visible) */}
                            <button
                                onClick={handleClose}
                                className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 transition"
                            >
                                <XMarkIcon className="h-8 w-8" />
                            </button>
    
                            {/* Content Wrapper */}
                            <div className="flex flex-col md:flex-row h-full overflow-y-auto">
                                {/* Left Column: Image + Name & Description */}
                                <div className="flex flex-col items-center w-full md:w-1/2 p-4">
                                    {/* Product Image */}
                                    <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={product.urlImg || "/placeholder.jpg"}
                                            alt={product.name || "Producto"}
                                            className="w-full h-80 object-cover"
                                        />
                                    </div>

                                    {/* Name & Description */}
                                    <div className="mt-4 text-center md:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-bold text-gray-800 border-t-2 border-gray-300 pt-2"
                                        >
                                            {capitalizeFirstLetter(product.name) || "Nombre del Producto"}
                                        </Dialog.Title>
    
                                        <p 
                                            className="text-lg text-gray-600 mt-2"
                                            dangerouslySetInnerHTML={{ __html: capitalizeFirstLetter(product.description || "No hay descripción disponible...") }} 
                                        />
                                    </div>
                                </div>

                                <div className="hidden md:block w-px bg-gray-300 my-2"></div>
    
                                {/* Right Column: Product Info */}
                                <div className="p-4 w-full md:w-1/2 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <p className="text-slate-800 text-sm mt-2 truncate border-b border-gray-300 pb-3">
                                            Categoría:{" "}
                                            <span className="font-semibold">
                                                {capitalizeFirstLetter(
                                                    product.productType.name
                                                )}
                                            </span>
                                        </p>

                                        <p className="text-gray-700">
                                            <strong>Marca:</strong>{" "}
                                            {product.variants[0].description || "N/A"}
                                        </p>
                                        
                                        {/* Product Prices in Modal */}
                                        <div className="mt-4 space-y-2">
                                            {/* Base Price */}
                                            {basePrice && (
                                                <p className="text-gray-700 text-sm font-medium">
                                                    <strong>Precio Base:</strong> {formatToCLP(parseInt(basePrice))}
                                                </p>
                                            )}

                                            {/* Price Section */}
                                            <div className="mt-1">
                                                {!discount ? (
                                                    // No Discount: Show Final Price Normally
                                                    <p className="text-orange-500 text-lg font-bold">
                                                        <strong>Precio de Venta:</strong> {finalPrice ? formatToCLP(parseInt(finalPrice)) : "N/A"}
                                                    </p>
                                                ) : (
                                                    // Discounted Price
                                                    <div>
                                                        {/* Strikethrough Original Price */}
                                                        <p className="text-gray-500 text-sm line-through">
                                                            <strong>Antes:</strong> {finalPrice ? formatToCLP(parseInt(finalPrice)) : "N/A"}
                                                        </p>

                                                        {/* New Discounted Price */}
                                                        <p className="text-orange-500 text-xl font-extrabold">
                                                            <strong>Ahora:</strong> {finalPrice ? formatToCLP(parseInt(finalPrice) * 0.80) : "N/A"}
                                                        </p>

                                                        {/* Discount Percentage */}
                                                        <p className="text-green-600 text-sm font-semibold">
                                                            🔥 {discount}% OFF
                                                        </p>
                                                    </div>
                                                )}

                                                {/* IVA Included */}
                                                <p className="text-gray-400 text-xs italic mt-1">IVA incluido</p>
                                            </div>
                                        </div>

                                        <p className="text-center font-semibold text-slate-600 border-t border-gray-300 pt-2">Disponibilidad:</p>
                                        <div className="flex justify-center gap-3 border-b border-gray-300 pb-4">
                                            <p
                                                className={`${
                                                    hasStock
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-red-200 text-red-800"
                                                } rounded-full w-full text-sm truncate text-center font-semibold`}
                                            >
                                                {hasStock
                                                    ? "Con Stock"
                                                    : "Sin Stock"}
                                            </p>
                                            <p
                                                className={`${
                                                    product.state
                                                        ? "bg-blue-200 text-blue-800"
                                                        : "bg-red-200 text-red-800"
                                                } rounded-full w-full text-sm truncate text-center font-semibold`}
                                            >
                                                {product.state ? "Activo" : "Inactivo"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-center my-0 sm:my-10">
                                        <button 
                                            onClick={handleDecrease} 
                                            className="px-3 py-1 bg-gray-300 rounded-l-lg hover:bg-gray-400"
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="text" 
                                            value={quantity} 
                                            readOnly
                                            className="w-32 h-8 text-center border-t border-b border-gray-300"
                                        />
                                        <button 
                                            onClick={handleIncrease} 
                                            disabled={totalStock <= quantity}
                                            className="px-3 py-1 bg-gray-300 rounded-r-lg hover:bg-gray-400"
                                        >
                                            +
                                        </button>
                                    </div>
    
                                    {/* Action Button */}
                                    <button 
                                        disabled={!hasStock}
                                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                                        onClick={handleAddToCart}
                                    >
                                        Agregar al Carrito 🛒
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );    
}
