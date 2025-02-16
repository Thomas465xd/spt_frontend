import { Product } from "@/types/index"

type ProductCardProps = {
    product: Product
}

export default function ProductCard({product} : ProductCardProps) {
    return (
        <div className="">
            <div className="border shadow-lg mx-auto md:w-full">
                
            </div>

            <div className="border p-5">
                <h2 className="text-2xl truncate font-black">{product.name}</h2>
                
            </div>
        </div>
    )
}
