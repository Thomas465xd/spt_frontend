import { getAllProductDescription } from "@/api/ProductAPI";
import CartDetailsModal from "@/components/cart/CartDetailsModal";
import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { ShoppingCartIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

export default function ProductsView() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not present
    const searchQuery = searchParams.get("searchName") || ""; // Obtener el término de búsqueda
    const searchCode = searchParams.get("searchCode") || ""; // Obtener el término de búsqueda

	// Get the 'productDetails' query param from the URL
	const queryParams = new URLSearchParams(location.search);
	const cartModal = queryParams.get("cart");

    const handleClick = () => {
		queryParams.set("cart", "true"); // Set the product code

		navigate(`${location.pathname}?${queryParams.toString()}`); // Navigate with the updated URL
	};

    if(page < 1) return <Navigate to={`/products?page=1`} replace />

    const itemsPerPage = 20;

    // Calculamos el offset
    const offset = (page - 1) * itemsPerPage;

    const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery({
        queryKey: ["products", page, searchQuery, searchCode],
        queryFn: () => getAllProductDescription({ limit: itemsPerPage, offset, name: searchQuery, code: searchCode }), 
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

            <p className="text-center text-gray-500 my-10">No hay Resultados de Busqueda para: <span className="font-bold italic">"{searchParams.get("searchName") ? searchParams.get("searchName") : searchParams.get("searchCode")}"</span></p>

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
                inputType="text"
                formText="Buscar por Nombre de Producto..."
                searchText="Productos"
            />

            <SearchBar 
                route="products"
                param="searchCode"
                inputType="text"
                formText="Buscar por SKU/Código del Producto..."
                searchText="por SKU/Código"
            />

            {searchParams.has("searchName") || searchParams.has("searchCode") && (
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

            <button 
                className="fixed bottom-5 left-5 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
                onClick={handleClick}
                aria-label="Open shopping cart"
            >
                <ShoppingCartIcon className="w-6 h-6" />
            </button>

            {cartModal === "true" && (
                <CartDetailsModal />
            )}
        </>
    )
}
