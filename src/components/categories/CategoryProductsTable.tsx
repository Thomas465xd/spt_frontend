import { Product } from "@/types/index";
import ProductCard from "./CategoryProductCard";
import Pagination from "../ui/Pagination";

type CategoryProductsTableProps = {
    products: Product[];
    categoryId: number;
    page: number;
    totalPages: number;
};

export default function CategoryProductsTable({ products, page, totalPages }: CategoryProductsTableProps) {
    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-10">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>

            <Pagination
                route="categories/products"
                page={page}
                totalPages={totalPages}
            />
        </>
    );
}
