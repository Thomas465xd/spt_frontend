import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

type PaginationProps = {
    route: string;      // Route for pagination
    page: number;       // Current page
    totalPages: number; // Total number of pages
    maxPageButtons?: number; // Maximum number of page buttons to show (optional)
    searchQuery?: string; 
};

export default function Pagination({ route, page, totalPages, maxPageButtons = 5, searchQuery }: PaginationProps) {
    // Default to 5 page buttons (or less if fewer total pages)
    const actualMaxButtons = Math.min(maxPageButtons, totalPages);
    
    // Calculate which pages to show
    const getVisiblePages = () => {
        // If we have fewer pages than max buttons, show all pages
        if (totalPages <= actualMaxButtons) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        // Always show first and last page
        // Other buttons will be distributed around current page
        const sideButtonCount = Math.floor((actualMaxButtons - 2) / 2);
        
        let startPage = Math.max(2, page - sideButtonCount);
        let endPage = Math.min(totalPages - 1, page + sideButtonCount);
        
        // Adjust if we're near the beginning or end
        if (startPage <= 2) {
            endPage = Math.min(1 + actualMaxButtons, totalPages - 1);
        }
        if (endPage >= totalPages - 1) {
            startPage = Math.max(2, totalPages - actualMaxButtons);
        }
        
        const visiblePages = [1];
        
        // Add ellipsis after first page if needed
        if (startPage > 2) {
            visiblePages.push(-1); // -1 represents an ellipsis
        }
        
        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            visiblePages.push(-2); // -2 represents an ellipsis
        }
        
        // Add last page if we have more than one page
        if (totalPages > 1) {
            visiblePages.push(totalPages);
        }
        
        return visiblePages;
    };
    
    const visiblePages = getVisiblePages();

    return (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 my-12">
            {/* Previous page button */}
            {page > 1 && (
                <div className="-mt-px flex w-0 flex-1">
                    <Link
                        to={`${searchQuery ? `/${route}?page=${page - 1}&searchName=${searchQuery}` : `/${route}?page=${page - 1}`}`}
                        aria-label="Previous page"
                        className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        <ArrowLongLeftIcon aria-hidden="true" className="mr-3 size-5 text-gray-400" />
                        Anterior
                    </Link>
                </div>
            )}

            {/* Page buttons */}
            {visiblePages.map((pageNum, index) => {
                // Render ellipsis
                if (pageNum < 0) {
                    return (
                        <span 
                            key={`ellipsis-${index}`}
                            className="flex items-center justify-center w-10 h-10 text-gray-600"
                        >
                            &hellip;
                        </span>
                    );
                }
                
                // Render page button
                return (
                    <Link
                        key={`page-${pageNum}`}
                        to={`${searchQuery ? `/${route}?page=${pageNum}&searchName=${searchQuery}` : `/${route}?page=${pageNum}`}`}
                        className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${
                            page === pageNum
                                ? "border-orange-500 text-orange-600 ring-orange-500"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        {pageNum}
                    </Link>
                );
            })}

            {/* Next page button */}
            {page < totalPages && (
                <div className="-mt-px flex w-0 flex-1 justify-end">
                    <Link
                        to={`${searchQuery ? `/${route}?page=${page + 1}&searchName=${searchQuery}` : `/${route}?page=${page + 1}`}`}
                        aria-label="Next page"
                        className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                        Siguiente
                        <ArrowLongRightIcon aria-hidden="true" className="ml-3 size-5 text-gray-400" />
                    </Link>
                </div>
            )}
        </nav>
    );
}