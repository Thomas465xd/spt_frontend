import { getAllCategories } from "@/api/CategoryAPI"
import { getPriceLists } from "@/api/ProductAPI";
import CategoriesTable from "@/components/categories/CategoriesTable";
import CategorySearchBar from "@/components/categories/CategorySearchBar";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useSearchParams } from "react-router-dom";

export default function CategoriesView() {

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present
    const searchQuery = searchParams.get("search") || ""; // Obtener el término de búsqueda

    if(page < 1) return <Navigate to={`/categories?page=1`} replace />

    const itemsPerPage = 12;

    // Calculamos el offset
    const offset = (page - 1) * itemsPerPage;

    const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery({
        queryKey: ["categories", page, searchQuery],
        queryFn: () => getAllCategories({ 
            limit: itemsPerPage,
            offset,
            name: searchQuery || undefined
        }),
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
    //console.log(totalPages)

    // Handle loading state
    if (isLoadingCategories || isLoadingPrices) return <Loader />;
    
    // Handle errors
    if (isErrorCategories || isErrorPrices) return <Navigate to="/404" replace />;

    if(totalPages === 0 || page === 0) return (
        <>
            <Heading>Conoce Nuestras Categorías</Heading>

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
            <Heading>Conoce Nuestras Distintas Categorías</Heading>
            <p className="text-center text-slate-700 mt-10">
                Encuentra todas las categorias de productos que  
                    <span className="text-orange-500 font-bold"> Spare Parts Trade</span> ofrece.
            </p>
            <p className="text-center text-slate-700">
                Selecciona una Categoría para ver sus productos
            </p>

            <CategorySearchBar />

            <p className="text-center text-slate-600 mt-10">
                Categorías Cargadas: <span className="font-bold text-orange-500">{categories.length}</span>
            </p>

            <CategoriesTable
                categories={categories}
                page={page}
                totalPages={totalPages}
            />
        </>
    )
}
