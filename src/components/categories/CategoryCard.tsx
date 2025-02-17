import { Category } from "@/types/index";
import { capitalizeFirstLetter } from "@/utilities/text";
import { Link } from "react-router-dom";

type CategoryCardProps = {
    category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
    //console.log(category);

    return (
        <div className="relative group rounded-2xl shadow-md overflow-hidden transition-all duration-300 bg-white hover:shadow-xl hover:scale-105">
            {/* Background Gradient Overlay with orange tones */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 opacity-10 group-hover:opacity-30 transition-opacity duration-300"></div>

            {/* Category Content */}
            <div className="relative p-6 flex flex-col items-center text-center">
                {/* Category Name */}
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {capitalizeFirstLetter(category.name)}
                </h2>

                {/* Category ID */}
                <p className="text-slate-600 text-sm mt-2">
                    ID: <span className="font-medium">{category.id}</span>
                </p>

                {/* Category State */}
                <p
                    className={`mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                        category.state === 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                >
                    {category.state === 0 ? "Active" : "Inactive"}
                </p>

                {/* Action Button */}
                <Link
                    to={`/categories/products?category=${category.id}`}
                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                    Ver Productos
                </Link>
            </div>
        </div>
    );
}
