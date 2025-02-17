import { Categories } from "@/types/index"
import CategoryCard from "./CategoryCard"
import CategoriesPagination from "./CategoriesPagination"


type CategoriesTableProps = {
    categories: Categories
    page: number
    totalPages: number
}

export default function CategoriesTable({ categories, page, totalPages } : CategoriesTableProps) {

    // console.log(categories)

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-10">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id} 
                            category={category} 
                        />
                    ))}
                </div>
            </div>

            <CategoriesPagination
                page={page}
                totalPages={totalPages}
            />
        </>
    )
}
