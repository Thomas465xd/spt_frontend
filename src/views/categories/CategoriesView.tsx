import { getAllCategories, getPriceLists } from "@/api/ProductAPI"
import CategoriesTable from "@/components/categories/CategoriesTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query"
import { Navigate, useSearchParams } from "react-router-dom";

export default function CategoriesView() {

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    if(page < 1) return <Navigate to={`/products?page=1`} replace />

    const itemsPerPage = 21;

    const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
    
    const { data: priceData, isLoading: isLoadingPrices, isError: isErrorPrices } = useQuery({
        queryKey: ["prices"],
        queryFn: getPriceLists,  // Correct function
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const categories = categoriesData?.items || [];
    const totalcategories = categoriesData?.count || 0;

    const totalPages = Math.ceil(totalcategories / itemsPerPage);

    // Handle loading state
    if (isLoadingCategories || isLoadingPrices) return <Loader />;
    
    // Handle errors
    if (isErrorCategories || isErrorPrices) return <Navigate to="/404" replace />;

    if(page > totalPages) return <Navigate to={`/categories?page=${totalPages}`} replace />

    return (
        <>
            <Heading>Conoce Nuestras Categorías</Heading>

            <CategoriesTable
                categories={categories}
            />
        </>
    )
}
