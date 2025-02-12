import { Link } from "react-router-dom";


type UsersPaginationProps = {
    route: string
    page: number
    totalPages: number
}

export default function UsersPagination({ route, page, totalPages }: UsersPaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center items-center gap-2 py-10">
            {page > 1 && (
                <Link
                    key={page}
                    to={`/admin/${route}?page=${page - 1}`}
                    className="flex items-center justify-center w-10 h-10 bg-white text-gray-900 text-lg font-bold rounded-md shadow-md ring-1 ring-gray-300 hover:bg-gray-100 transition-all"
                >
                    &laquo;
                </Link>
            )}

            {pages.map(currentPage => (
                <Link
                    key={currentPage}
                    to={`/admin/${route}?page=${currentPage}`}
                    className={`flex items-center justify-center w-10 h-10 px-4 py-2 text-sm font-bold rounded-md shadow-md ring-1 ring-gray-300 transition-all ${
                        page === currentPage 
                        ? "bg-orange-500 text-white ring-orange-500"
                        : "bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                >
                    {currentPage}
                </Link>
            ))}

            {page < totalPages && (
                <Link
                    to={`/admin/${route}?page=${page + 1}`}
                    className="flex items-center justify-center w-10 h-10 bg-white text-gray-900 text-lg font-bold rounded-md shadow-md ring-1 ring-gray-300 hover:bg-gray-100 transition-all"
                >
                    &raquo;
                </Link>
            )}
        </nav>
    );
}