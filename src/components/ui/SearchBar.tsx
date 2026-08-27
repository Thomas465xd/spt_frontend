import { useForm } from "react-hook-form";
import { SearchFormData } from "@/types/index";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { Search, ChevronDown, LucideIcon } from "lucide-react";

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
};

export default function SearchBar({
	route,
	param,
	inputType,
	formText,
	searchText,
	mini,
	options,
	defaultValue = "",
}: SearchBarProps) {
	const initialValues = {
		search: defaultValue,
	};

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SearchFormData>({
		defaultValues: initialValues,
	});

	const selectedValue = watch("search");
	const selectedOption =
		inputType === "select"
			? options?.find((opt) => opt.value === selectedValue)
			: null;

	const handleSearchForm = (formData: SearchFormData) => {
		const searchQuery = formData.search.trim();

		if (!searchQuery) {
			return;
		}

		navigate(
			`/${route}?page=1&${param}=${encodeURIComponent(searchQuery)}`,
		);
	};

	return (
		<div className="w-full max-w-2xl mx-auto mt-4">
			<form
				onSubmit={handleSubmit(handleSearchForm)}
				className="flex flex-col sm:flex-row items-stretch gap-2 rounded-md border border-gray-200 bg-white p-1.5 shadow-sm"
			>
				<div className="relative flex-grow">
					{inputType === "select" ? (
						<div className="relative">
							<div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
								{selectedOption?.icon ? (
									<selectedOption.icon
										size={18}
										className={
											selectedOption.color ||
											"text-gray-400"
										}
									/>
								) : (
									<Search
										size={18}
										className="text-gray-400"
									/>
								)}
							</div>

							<select
								className={`h-11 w-full appearance-none rounded-md border border-transparent bg-transparent pl-10 pr-9 text-sm text-gray-900 transition focus:border-orange-500 focus:bg-orange-50/40 focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
									selectedOption?.color
										? selectedOption.color
										: ""
								}`}
								{...register("search", {
									required: "Debes seleccionar una opción.",
								})}
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

							<ChevronDown
								size={16}
								className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
						</div>
					) : (
						<div className="relative">
							<Search
								size={18}
								className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								type={inputType}
								placeholder={formText}
								className={`${
									mini ? "h-9" : "h-11"
								} w-full rounded-md border border-transparent bg-transparent pl-10 pr-3 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-orange-50/40 focus:outline-none focus:ring-2 focus:ring-orange-500/30`}
								{...register("search", {
									required:
										"El campo de búsqueda es obligatorio.",
								})}
							/>
						</div>
					)}
				</div>

				<button
					type="submit"
					className={`flex items-center justify-center gap-2 rounded-md bg-orange-600 px-4 font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 sm:min-w-40 ${
						mini ? "h-9 text-sm" : "h-11"
					}`}
				>
					<Search size={16} />
					<span>Buscar {searchText}</span>
				</button>
			</form>

			{errors.search && (
				<div className="mt-1.5 px-1">
					<ErrorMessage mini>{errors.search.message}</ErrorMessage>
				</div>
			)}
		</div>
	);
}
