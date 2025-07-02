import { ProductWebType } from "@/types/index";
import ProductCard from "./ProductCard";
import { useAuth } from "@/hooks/useAuth";
import Loader from "../ui/Loader";
import { Navigate } from "react-router-dom";

type ProductsTableProps = {
    products: ProductWebType[];
};

export default function ProductsTable({ products } : ProductsTableProps) {

    const { data, isError, isLoading } = useAuth();

    if(isLoading) return <Loader />;

    if(isError) return <Navigate to="/auth/login" replace />;

    if(products && data) return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-10 gap-10">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            customDiscount={data.discount || 20}
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
