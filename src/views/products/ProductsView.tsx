import { getAllProductDescription } from "@/api/ProductAPI";
import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useSearchParams } from "react-router-dom";

export default function ProductsView() {

    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present
    const searchQuery = searchParams.get("searchName") || ""; // Obtener el término de búsqueda

    if(page < 1) return <Navigate to={`/products?page=1`} replace />

    const itemsPerPage = 20;

    // Calculamos el offset
    const offset = (page - 1) * itemsPerPage;

    const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery({
        queryKey: ["products", page, searchQuery],
        queryFn: () => getAllProductDescription({ limit: itemsPerPage, offset, name: searchQuery }), 
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const products = productsData?.data || [];
    const totalProducts = productsData?.count || 0;

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    

    if(isLoadingProducts) return <Loader />

    if(isErrorProducts) return <Navigate to="/404" />

    if(totalPages === 0 || page === 0) return (
        <>
            <Heading>Producto no Encontrado</Heading>

            <p className="text-center text-gray-500 my-10">No hay Resultados de Busqueda para: <span className="font-bold italic">"{searchParams.get("searchName")}"</span></p>

            <Link
                to="/products?page=1"
                className="mt-6 px-6 py-3 grid place-content-center text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >Volver a Productos</Link>
        </>
    )

    // Si la página es mayor que el total de páginas, redirigimos a la última página
    if(page > totalPages) return <Navigate to={`/products?page=${totalPages}`} replace />

    return (
        <>
            <Heading>Conoce Nuestros Productos</Heading>
            <p className="text-center mt-5 text-gray-500">Usa nuestro <span className="font-bold text-orange-500">Buscador de productos por Código</span> para encontrar el producto que necesitas</p>

            {/* Product Search Form */}
            <SearchBar 
                route="products"
                param="searchName"
                formText="Buscar por Nombre de Producto..."
                searchText="Productos"
            />

            {searchParams.has("searchName") && (
                <Link
                    to="/products"
                    className="mt-6 px-6 py-3 mx-auto grid place-content-center max-w-md lg:max-w-lg text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Volver a Productos
                </Link>
            )}

            <p className="mt-10 text-center text-gray-500">Productos Cargados: {" "}
                <span className="font-bold text-orange-500">{totalProducts}</span>
            </p>

            <ProductsTable 
                products={products}
            />

            {/* Pagination */}
            <Pagination
                route="products"
                page={page}
                totalPages={totalPages}
            />
        </>
    )
}
