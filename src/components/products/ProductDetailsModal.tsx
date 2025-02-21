import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ProductWebType } from "@/types/index";
import { formatToCLP } from "@/utilities/price";
import { capitalizeFirstLetter } from "@/utilities/text";

type ProductDetailsModalProps = {
	product: ProductWebType;
};

export default function ProductDetailsModal({
	product,
}: ProductDetailsModalProps) {
	const location = useLocation();
	const navigate = useNavigate();

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

    const handleAddToCart = () => {
        
    }

    const basePrice = product.variants[0].salePrices.price ?? "N/A"; // Default value if salePrices is undefined
    const finalPrice = product.variants[0].salePrices.finalPrice ?? "N/A"; // Default value if salePrices is undefined

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
                                            {product?.name || "Nombre del Producto"}
                                        </Dialog.Title>
    
                                        <p className="text-lg text-gray-600 mt-2">
                                            {product?.description || "Descripción del producto..."}
                                        </p>
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
                                        
                                        <p className="text-gray-700">
                                            <strong>Precio Base:</strong>{" "}
                                            {basePrice ? formatToCLP(parseInt(basePrice)) : "N/A"}
                                        </p>
    
                                        <div>
                                            <p className="text-orange-500">
                                                <strong>Precio de Venta:</strong>{" "}
                                                {finalPrice ? formatToCLP(parseInt(finalPrice)) : "N/A"}
                                            </p>

                                            <p className="text-gray-400 text-sm space-y-0">IVA incluido</p>
                                        </div>
                                        <p className="text-center font-semibold text-slate-600 border-t border-gray-300 pt-2">Disponibilidad:</p>
                                        <div className="flex justify-center gap-3 border-b border-gray-300 pb-4">
                                            <p
                                                className={`${
                                                    product.baseInfo.stockControl
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-red-200 text-red-800"
                                                } rounded-full w-full text-sm truncate text-center font-semibold`}
                                            >
                                                {product.baseInfo.stockControl
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
    
                                    {/* Action Button */}
                                    <button 
                                        className="mt-6 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
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
