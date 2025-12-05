import { useForm } from "react-hook-form";
import { SearchFormData } from "@/types/index";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { Search, LucideIcon } from "lucide-react";

export type SelectOption = {
    value: string;
    label: string;
    icon?: LucideIcon;
    color?: string;
};

type SearchBarProps = {
    route: string;
    param: string;
    inputType: string;
    formText: string;
    searchText: string;
    mini?: boolean; 
    options?: SelectOption[];
    defaultValue?: string;
}

export default function SearchBar({
    route, 
    param, 
    inputType, 
    formText, 
    searchText,
    mini,
    options,
    defaultValue = ""
}: SearchBarProps) {
    const initialValues = {
        search: defaultValue
    };

    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<SearchFormData>({
        defaultValues: initialValues
    });

    const selectedValue = watch("search");
    const selectedOption = inputType === "select" 
        ? options?.find(opt => opt.value === selectedValue)
        : null;

    const handleSearchForm = (formData: SearchFormData) => {
        const searchQuery = formData.search.trim();
        
        if (!searchQuery) {
            return;
        }
        
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
                    {inputType === "select" ? (
                        <div className="relative">
                            {selectedOption?.icon && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <selectedOption.icon 
                                        size={18} 
                                        className={selectedOption.color || "text-gray-400"}
                                    />
                                </div>
                            )}
                            <select
                                className={`p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white ${
                                    selectedOption?.icon ? "pl-10" : ""
                                } ${
                                    selectedOption?.color ? `${selectedOption.color}` : "text-gray-900"
                                }`}
                                {...register("search", { required: "Debes seleccionar una opción." })}
                            >
                                <option value="" disabled>
                                    {formText}
                                </option>
                                {options?.map((option) => (
                                    <option 
                                        key={option.value} 
                                        value={option.value}
                                        className="text-gray-900"
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <input 
                            type={inputType}
                            placeholder={formText}
                            className={`${mini ? "p-0.5 px-2" : "p-3"} w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition`}
                            {...register("search", { required: "El campo de búsqueda es obligatorio." })}
                        />
                    )}
                </div>

                <button 
                    type="submit" 
                    className={`min-w-40 sm:min-w-44 ${mini ? "p-0.5" : "p-3"} text-white bg-orange-600 hover:bg-orange-700 transition-colors rounded-lg font-semibold shadow-md flex gap-2 items-center justify-center`}
                >
                    <Search size={18} />
                    Buscar {searchText}
                </button>
            </form>

            <div className="w-full max-w-2xl mx-auto">
                {errors.search && (
                    <ErrorMessage mini>{errors.search.message}</ErrorMessage>
                )}
            </div>
        </>
    );
}