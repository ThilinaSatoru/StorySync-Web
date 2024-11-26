import React, { useState, useMemo } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,

} from "@/components/ui/pagination";

// Generic type for paginated data
interface PaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
    renderItem: (item: T) => React.ReactNode;
    variant?: 'table' | 'grid' | 'list';
    gridClass?: string;
}

export function PaginatedContent<T>({
    items,
    itemsPerPage = 6,
    renderItem,
    variant = 'grid',
    gridClass = "grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
}: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    // Generate page numbers to display
    const pageNumbers = useMemo(() => {
        const range = 5; // Number of page numbers to show on each side of current page
        let start = Math.max(1, currentPage - range);
        let end = Math.min(totalPages, currentPage + range);

        // Adjust start and end to always show 10 page numbers if possible
        if (end - start + 1 < 10) {
            if (start === 1) {
                end = Math.min(totalPages, start + 9);
            } else {
                start = Math.max(1, end - 9);
            }
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [currentPage, totalPages]);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    // Render variants (same as previous implementation)
    const renderVariant = () => {
        const currentItems = getCurrentPageItems();

        switch (variant) {
            case 'table':
                return (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b">
                                    {renderItem(item)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );

            case 'grid':
                return (
                    <div className={gridClass}>
                        {currentItems.map((item, index) => (
                            <div key={index} className="p-4">
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        {currentItems.map((item, index) => (
                            <div key={index} className="p-4 border rounded hover:bg-gray-50">
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                );
        }
    };

    // Don't render pagination if there's only one page
    if (totalPages <= 1) {
        return renderVariant();
    }

    const pageSecItemClass = "cursor-pointer"
    const pageItemClass = "cursor-pointer bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-md"
    const currentPageItemClass = "bg-sky-500"

    return (
        <div>
            {renderVariant()}

            <div className="mt-6 flex justify-center items-center">
                <Pagination>
                    <PaginationContent>
                        {/* First page button */}
                        {currentPage > 1 && (
                            <PaginationItem className={pageSecItemClass}>
                                <PaginationLink onClick={() => goToPage(1)}>
                                    First
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Previous page button */}
                        {currentPage > 1 && (
                            <PaginationItem className={pageSecItemClass}>
                                <PaginationLink onClick={() => goToPage(Math.max(1, currentPage - 1))}>
                                    Prev
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Ellipsis before page numbers if needed */}
                        {pageNumbers[0] > 1 && (
                            <PaginationItem className={pageItemClass}>
                                <PaginationLink>...</PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Page numbers */}
                        {pageNumbers.map((page) => (
                            <PaginationItem key={page} className={pageItemClass}>
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => goToPage(page)}
                                    className={`${currentPage === page ? currentPageItemClass : ""}`}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {/* Ellipsis after page numbers if needed */}
                        {pageNumbers[pageNumbers.length - 1] < totalPages && (
                            <PaginationItem>
                                <PaginationLink>...</PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Next page button */}
                        {currentPage < totalPages && (
                            <PaginationItem className={pageSecItemClass}>
                                <PaginationLink onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}>
                                    Next
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Last page button */}
                        {currentPage < totalPages && (
                            <PaginationItem className={pageSecItemClass}>
                                <PaginationLink onClick={() => goToPage(totalPages)}>
                                    Last
                                </PaginationLink>
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}