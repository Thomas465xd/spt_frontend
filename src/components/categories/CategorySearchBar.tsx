import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SearchFormData } from "@/types/index";
import ErrorMessage from "../ui/ErrorMessage";
import { useNavigate } from "react-router-dom";

export default function ProductsSearchForm() {
    const initialValues = {
        search: "" 
    };

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
        defaultValues: initialValues
    });

    const handleSearchForm = (formData: SearchFormData) => {
        //console.log("Search Query:", formData.search);
        const searchQuery = formData.search.trim();

        if (!formData.search.trim()) {
            toast.error("El campo de búsqueda no puede estar vacío.");
            return;
        }

        // Actualizar la URL con el parámetro de búsqueda
        navigate(`/categories?page=1&search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <form 
            onSubmit={handleSubmit(handleSearchForm)} 
            className="flex items-center gap-2 mt-10 bg-white shadow-md rounded-lg p-2 w-full max-w-md mx-auto"
        >
            <div className="relative flex-grow">
                <input 
                    type="text"
                    placeholder="Buscar categorías..."
                    className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    {...register("search", { required: "El campo de búsqueda es obligatorio." })}
                />
                {errors.search && (
                    <ErrorMessage>{errors.search.message}</ErrorMessage>
                )}
            </div>

            <button 
                type="submit" 
                className="p-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors rounded-lg font-semibold shadow-md"
            >
                Buscar 🔍
            </button>
        </form>
    );
}
