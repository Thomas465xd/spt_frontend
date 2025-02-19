import { getCategory, getProductsByCategory } from "@/api/CategoryAPI";
import CategoryProductsTable from "@/components/categories/CategoryProductsTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { capitalizeFirstLetter } from "@/utilities/text";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useSearchParams } from "react-router-dom";

export default function CategoryProductsView() {

    const [searchParams] = useSearchParams();
    const categoryId = parseInt(searchParams.get("category") || "", 10);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present

    const itemsPerPage = 18;
    const offset = (page - 1) * itemsPerPage;

    // Query to get category data
    const { data: category, isLoading: isLoadingCategory, isError: isErrorCategory } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategory({ categoryId }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    // Query to get products by category data
    const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery({
        queryKey: ["products", categoryId, page],
        queryFn: () => getProductsByCategory({ categoryId }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: !!categoryId, // Ensures that this query only runs if categoryId is available
    });

    console.log(products);

    const totalProducts = products?.count || 0;

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Handle loading states
    if (isLoadingCategory || isLoadingProducts) return <Loader />;

    // Handle errors
    if (isErrorCategory || isErrorProducts) return <Navigate to="/categories" replace />;

    // Ensure category and products data is available
    if (!category || !products) return <Navigate to="/categories" replace />;

    if(totalPages === 0 || page === 0) return (
        <>
            <Heading>Productos Disponibles</Heading>

            <p className="text-center text-gray-500 my-10">No hay Resultados de Busqueda.</p>

            <Link
                to="/categories?page=1"
                className="mt-6 px-6 py-3 grid place-content-center text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >Volver a Categorías</Link>
        </>
    )

    // Si la página es mayor que el total de páginas, redirigimos a la última página
    if(page > totalPages) return <Navigate to={`/categories?page=${totalPages}`} replace />

    return (
        <>
            <Heading>Productos relacionados a la categoría: {capitalizeFirstLetter(category.name)}</Heading>

            <p className="text-center text-slate-800 mt-10">
                En esta sección podrás encontrar todos los productos relacionados a la categoría {capitalizeFirstLetter(category.name)}
            </p>

            {/** Product Search Bar */}
            
            <CategoryProductsTable 
                categoryId={category.id} 
                page={page}
                totalPages={totalPages}
                products={products.items} 
            />
        </>
    );
}
