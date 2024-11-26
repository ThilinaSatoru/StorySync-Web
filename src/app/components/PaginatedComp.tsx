import React, { useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generic type for paginated data
interface PaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
    renderItem: (item: T) => React.ReactNode;
    variant?: 'table' | 'grid' | 'list';
}

export function PaginatedContent<T>({
    items,
    itemsPerPage = 6,
    renderItem,
    variant = 'grid'
}: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    // Pagination handlers
    const goToNextPage = () => {
        setCurrentPage(Math.min(currentPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage(Math.max(currentPage - 1, 1));
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    // Render variants
    const renderVariant = () => {
        const currentItems = getCurrentPageItems();

        switch (variant) {
            case 'table':
                return (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                {/* Add table headers as needed */}
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
                    <div className="grid grid-cols-3 gap-4">
                        {currentItems.map((item, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    {renderItem(item)}
                                </CardContent>
                            </Card>
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

    return (
        <div>
            {renderVariant()}

            <div className="mt-6 flex justify-center items-center space-x-2">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={goToPreviousPage}
                            // disabled={currentPage === 1}
                            />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    isActive={currentPage === index + 1}
                                    onClick={() => goToPage(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={goToNextPage}
                            // disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}