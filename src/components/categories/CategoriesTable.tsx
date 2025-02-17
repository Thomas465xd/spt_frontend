import { Category } from "@/types/index"
import ProductTable from "../products/ProductTable"


type CategoriesTableProps = {
    categories: Category[]
}

export default function CategoriesTable({ categories } : CategoriesTableProps) {
    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-10">
                    {categories.map((category) => (
                        <ProductTable
                            key={category.id} 
                            category={category} 
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
