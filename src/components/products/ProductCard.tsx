import { Product } from "@/types/index"

type ProductCardProps = {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="w-full md:w-auto"> {/* Adjusted width for responsiveness */}
            <div className="border border-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
                {/* Placeholder for Product Image / Background */}
                <div className="bg-orange-500 h-40 flex items-center justify-center text-white text-lg font-semibold">
                    No Image Available
                </div>

                {/* Product Details */}
                <div className="p-5 bg-white">
                    <h2 className="text-xl font-semibold text-slate-800 truncate">{product.name}</h2>
                    <p className="text-slate-600 text-sm mt-2">{product.description ? product.description : "No description available"}</p>

                    {/* Price & Action Button */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-orange-600">$21000000</span>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition duration-300">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
