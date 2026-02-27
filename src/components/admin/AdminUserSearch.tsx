import { useForm } from "react-hook-form";
import { SearchFormData } from "@/types/index";
import { useState } from "react";
import { Search } from "lucide-react";
import ErrorMessage from "../ui/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getUserByIdentification } from "@/api/AdminAPI";

import AdminDiscountForm from "@/components/admin/AdminDiscountForm";

export default function AdminDiscount() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);

    // Obtener usuario con useQuery
    const { data, isLoading, error } = useQuery({
        queryKey: ["userDiscount", searchQuery],
        queryFn: () => getUserByIdentification({ identificationId: searchQuery }),
        enabled: shouldSearch && !!searchQuery.trim(),  // Solo ejecuta si shouldSearch es true y hay searchQuery
        retry: false
    });

    const initialValues = {
        search: "" 
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SearchFormData>({
        defaultValues: initialValues
    });

    const handleSearchForm = (formData: SearchFormData) => {
        const trimmedQuery = formData.search.trim();
        
        if (trimmedQuery) {
            setSearchQuery(trimmedQuery);
            setShouldSearch(true);
        }

        reset()
    };

    return (
        <>
            <form 
                onSubmit={handleSubmit(handleSearchForm)} 
                className="flex items-center gap-2 mt-6 bg-white shadow-md rounded-lg p-2 w-full max-w-2xl mx-auto"
            >
                <div className="relative flex-grow">
                    <input 
                        type="text"
                        placeholder="Ingresa el ID o Email del Usuario"
                        className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        
                        {...register("search", {
                            required: "El campo de búsqueda no puede ir vacío",
                        })}
                    />
                </div>

                <button 
                    type="submit" 
                    className="p-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors rounded-lg font-semibold shadow-md flex gap-2 items-center justify-center"
                    disabled={isLoading}
                >
                    <Search size={18} />
                    {isLoading ? "Buscando..." : "Buscar Usuario"}
                </button>
            </form>

            <div className="w-full max-w-2xl mx-auto mt-2">
                {errors.search && (
                    <ErrorMessage>{errors.search.message}</ErrorMessage>
                )}
                
                {/* Display search results or errors */}
                {error && (
                    <ErrorMessage>Error al buscar usuario: {error.message}</ErrorMessage>
                )}
                
                {data ? (
                    <>
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm max-w-2xl mx-auto">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Usuario Encontrado:
                                <span className="ml-2 font-normal">{data.name}</span>
                            </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-green-900">
                                    <div>
                                        <span className="font-medium">ID Empresa:</span> {data.businessId}
                                    </div>
                                    <div>
                                        <span className="font-medium">Empresa:</span> {data.businessName}
                                    </div>
                                </div>
                            </div>

                        <AdminDiscountForm
                            userId={data._id}
                            currentDiscount={data.discount}
                            userName={data.name}
                        />
                    </>
                ) : (
                    <>
                        <p className="text-center mt-8 mb-4 text-gray-400">
                            Los Resultados se mostraran aqui
                        </p>
                    </>
                ) }
            </div>
        </>
    );
}