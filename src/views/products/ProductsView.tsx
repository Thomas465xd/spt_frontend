import { getAllProducts, getPriceLists } from "@/api/ProductAPI"
import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query"
import { Navigate, useSearchParams } from "react-router-dom";

export default function ProductsView() {

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    if(page < 1) return <Navigate to={`/products?page=1`} replace />

    const itemsPerPage = 21;

    const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    
    const { data: priceData, isLoading: isLoadingPrices, isError: isErrorPrices } = useQuery({
        queryKey: ["prices"],
        queryFn: getPriceLists,  // Correct function
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const products = productsData?.items || [];
    const totalProducts = productsData?.count || 0;

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Handle loading state
    if (isLoadingProducts || isLoadingPrices) return <Loader />;
    
    // Handle errors
    if (isErrorProducts || isErrorPrices) return <Navigate to="/404" replace />;

    if(page > totalPages) return <Navigate to={`/products?page=${totalPages}`} replace />

    return (
        <>
            <Heading>Conoce Nuestros Productos</Heading>

            <ProductsTable
                products={products}
            />
        </>
    )
}
