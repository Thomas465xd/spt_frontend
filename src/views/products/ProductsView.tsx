import { getCategory } from "@/api/ProductAPI";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useSearchParams } from "react-router-dom";

export default function ProductsView() {

    const [searchParams] = useSearchParams();
    const categoryId = parseInt(searchParams.get("category") || "", 10);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    const itemsPerPage = 18

    const offset = (page - 1) * itemsPerPage

    const { data, isLoading, isError } = useQuery({
        queryKey: ["products", categoryId, page],
        queryFn: () => getCategory({ categoryId }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const category = data

    if(isError) return <Navigate to={`/categories`} replace />

    if(isLoading) return <Loader />

    if(!categoryId) return <Navigate to={`/categories`} replace />

    if(page < 1) return <Navigate to={`/categories/products?category=${categoryId}&page=1`} replace />

    return (
        <>

        </>
    )
}
