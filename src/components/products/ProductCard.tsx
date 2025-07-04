import { useLocation, useNavigate } from "react-router-dom";
import { ProductWebType } from "@/types/index";
import { formatToCLP } from "@/utilities/price";
import { capitalizeFirstLetter } from "@/utilities/text";
import ProductDetailsModal from "./ProductDetailsModal";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";
import { copyToClipboard } from "@/utilities/copy";

type ProductCardProps = {
	product: ProductWebType;
    customDiscount: number; 
};

export default function ProductCard({ product, customDiscount }: ProductCardProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const { cartId, fetchCartDetails, addItemToCart } = useCart();

	// Get the 'productDetails' query param from the URL
	const queryParams = new URLSearchParams(location.search);
	const productDetails = queryParams.get("productDetails");

	// Handle click on "Ver Detalles"
	const handleClick = () => {
		const params = new URLSearchParams(location.search);
		params.set("productDetails", product.variants?.[0]?.code || ""); // Set the product code

		navigate(`${location.pathname}?${params.toString()}`); // Navigate with the updated URL
	};

	useEffect(() => {
		if (cartId) {
			fetchCartDetails();
		}
	}, [cartId]);

	const handleAddToCart = async () => {
		const discount =
			product.variants[0].discounts.length > 0
				? product.variants[0].discounts[0] // O usar reduce() si los descuentos se suman
				: customDiscount; // Si no hay descuentos, asignar 0

		const formData = {
			cartDetails: [
				{
					quantity: 1,
					unitValue: parseInt(finalPrice),
					image: product.urlImg,
					idVarianteProducto: product.variants[0].id,
					itemName: product.name,
					productWebId: product.productId,
					discount: discount,
				},
			],
		};

		await addItemToCart(formData);
	};

	const basePrice = product.variants[0].salePrices.price ?? "N/A"; // Default value if salePrices is undefined
	const finalPrice = product.variants[0].salePrices.finalPrice ?? "N/A"; // Default value if salePrices is undefined

	const hasStock = product.variants[0].stockInfo?.[0]?.quantityAvailable > 0;

    //! Hardcoded discount value | it will be gone once discounts are configured
    const discount = product.variants[0].discounts.length > 0 ? product.variants[0].discounts[0] : customDiscount;

	return (
		<>
			<div className="w-full md:w-auto">
				<div className="border border-slate-300 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-101 transition duration-300 ease-in-out">
					{/* Image */}
					<div className="relative w-full h-48">
						<img
							src={product.urlImg}
							alt={product.name}
							className="w-full h-48 object-cover rounded-t-lg"
							onContextMenu={(e) => e.preventDefault()}
						/>
						<div className="absolute top-0 left-0 w-full h-full bg-white opacity-0" />
						<div className="relative bottom-4 left-2 opacity-30">
							<img
								src="/logo.svg"
								alt="Logo"
								className="w-10 h-10"
							/>
						</div>
					</div>

					{/* Product Details */}
					<div className="p-4 bg-white">
						{/* Product Name */}
						<h2 className="text-xl font-semibold text-slate-800 truncate">
							{capitalizeFirstLetter(product.name)}
						</h2>

						{/* Product ID */}
						<p
							className="text-slate-600 text-sm mt-2 hover:cursor-pointer hover:underline"
							onClick={() =>
								copyToClipboard(product.variants[0].code)
							}
						>
							SKU:{" "}
							<span className="font-semibold">
								{product.variants[0].code}
							</span>
						</p>

                        {/* Product Prices */}
                        <div className="mt-2">
                            {/* Base Price (Subtle Gray) */}
                            {basePrice && (
                                <p className="text-gray-400 text-sm font-medium">
                                    Precio Neto: {formatToCLP(parseInt(basePrice))}
                                </p>
                            )}

                            {/* Price Display */}
                            {!discount ? (
                                // Final Price (No Discount)
                                <p className="text-orange-600 text-xl font-bold mt-1">
                                    {basePrice ? formatToCLP(parseInt(basePrice)) : "N/A"}
                                </p>
                            ) : (
                                // Discounted Price
                                <div className="mt-1">
                                    {/* Original Price (Strikethrough)
                                    <p className="text-gray-500 text-sm font-medium line-through">
                                        {finalPrice ? formatToCLP(parseInt(finalPrice)) : "N/A"}
                                    </p>
                                    */}

                                    {/* Discounted Price (Bold & Highlighted) */}
                                    <p className="text-orange-600 text-2xl font-bold">
                                        {basePrice ? formatToCLP(parseInt(basePrice) * (1 - (customDiscount / 100))) : "N/A"}
                                    </p>

                                    {/* Discount Percentage */}
                                    <p className="text-green-600 text-sm font-semibold">
                                        🔥 {discount}% OFF
                                    </p>
                                </div>
                            )}
                        </div>

						{/* Product Category */}
						<p className="text-slate-800 text-sm mt-2 truncate">
							Categoría:{" "}
							<span className="font-semibold">
								{capitalizeFirstLetter(
									product.productType.name
								)}
							</span>
						</p>

						<p className="text-slate-800 text-sm mt-2 truncate">
							Marca:{" "}
							<span className="font-semibold">
								{capitalizeFirstLetter(
									product.variants[0].description ||
										"No Disponible"
								)}
							</span>
						</p>

                        {/* Product Description */}
                        <p 
                            className="text-slate-800 text-sm mt-2 truncate" 
                            dangerouslySetInnerHTML={{ __html: capitalizeFirstLetter(product.description || "No Disponible") }} 
                        />

						<div className="flex justify-center gap-3">
							<p
								className={`${
									hasStock
										? "bg-green-200 text-green-800"
										: "bg-red-200 text-red-800"
								} rounded-full w-full text-sm mt-5 truncate text-center font-semibold`}
							>
								{hasStock ? "Con Stock" : "Sin Stock"}
							</p>
							<p
								className={`${
									product.state
										? "bg-blue-200 text-blue-800"
										: "bg-red-200 text-red-800"
								} rounded-full w-full text-sm mt-5 truncate text-center font-semibold`}
							>
								{product.state ? "Activo" : "Inactivo"}
							</p>
						</div>

						{/* Add to Cart Button - Disabled if no stock */}
						<button
							disabled={!hasStock}
							className={`mt-4 w-full py-2 font-semibold rounded-lg transition duration-200 ${
								hasStock
									? "bg-orange-600 text-white hover:bg-orange-700"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
							onClick={handleAddToCart}
						>
							Añadir al Carrito
						</button>

						{/* View Details Button */}
						<button
							className="mt-4 w-full py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900"
							onClick={handleClick}
						>
							Ver Detalles
						</button>
					</div>
				</div>
			</div>

			{/* Conditionally render the ProductDetailsModal */}
			{productDetails === product.variants?.[0]?.code && (
				<ProductDetailsModal
                    product={product} 
                    customDiscount={customDiscount}
                />
			)}
		</>
	);
}
