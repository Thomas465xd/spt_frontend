import { ProductWebType } from "@/types/index"
import { formatToCLP } from "@/utilities/price"

type ProductCardProps = {
    product: ProductWebType
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
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
                        <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-4 bg-white">
                    {/* Product Name */}
                    <h2 className="text-xl font-semibold text-slate-800 truncate">{product.name}</h2>

                    {/* Product Price */}
                    <p className="text-orange-600 text-lg font-bold mt-2">{formatToCLP(product.baseInfo.basePrice)}</p>

                    {/* Product Description */}
                    <p className="text-slate-800 text-sm mt-2 truncate">{product.description}</p>

                    {/* Add to Cart Button */}
                    <button className="mt-4 w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition duration-200">
                        Añadir al Carrito
                    </button>

                    <button className="mt-4 w-full py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    )
}
