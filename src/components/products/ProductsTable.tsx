import { ProductWebType } from "@/types/index";

type ProductsTableProps = {
    products: ProductWebType[];
};

export default function ProductsTable({ products } : ProductsTableProps) {
    
    return (
        <>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-10">
                    
                </div>
            </div>
        </>
    );
}
