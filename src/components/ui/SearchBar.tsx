import { useForm } from "react-hook-form";
import { SearchFormData } from "@/types/index";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { Search } from "lucide-react";

type SearchBarProps = {
    route: string;
    param: string;
    inputType: string;
    formText: string;
    searchText: string;
}

export default function SearchBar({route, param, inputType, formText, searchText} : SearchBarProps) {
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
        
        // Actualizar la URL con el parámetro de búsqueda
        navigate(`/${route}?page=1&${param}=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <>
            <form 
                onSubmit={handleSubmit(handleSearchForm)} 
                className="flex items-center gap-2 mt-6 bg-white shadow-md rounded-lg p-2 w-full max-w-2xl mx-auto"
            >
                <div className="relative flex-grow">
                    <input 
                        type={inputType}
                        placeholder={formText}
                        className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        {...register("search", { required: "El campo de búsqueda es obligatorio." })}
                    />
                </div>


                <button 
                    type="submit" 
                    className="p-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors rounded-lg font-semibold shadow-md flex gap-2 items-center justify-center"
                >
                    <Search size={18} />
                    Buscar {searchText}
                </button>
            </form>

            <div className="w-full max-w-2xl mx-auto mt-2">
                {errors.search && (
                    <ErrorMessage>{errors.search.message}</ErrorMessage>
                )}
            </div>
        </>
    );
}
