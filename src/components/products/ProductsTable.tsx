import { ProductWebType } from "@/types/index";
import ProductCard from "./ProductCard";

type ProductsTableProps = {
    products: ProductWebType[];
};

export default function ProductsTable({ products } : ProductsTableProps) {

    if(products) return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-10 gap-10">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-10 gap-10">
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5 flex justify-center items-center text-lg font-semibold text-slate-800">No products found</div>
                </div>
            </div>
        </>
    )
}
