import React from 'react'
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function TableSkeleton() {
    return (
        <TableBody>
            {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-2">
                            {[...Array(3)].map((_, tagIndex) => (
                                <Skeleton key={tagIndex} className="h-6 w-12 rounded" />
                            ))}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-2">
                            {[...Array(2)].map((_, authorIndex) => (
                                <Skeleton key={authorIndex} className="h-6 w-16 rounded" />
                            ))}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-16 rounded" />
                            <Skeleton className="h-8 w-16 rounded" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

export default TableSkeleton
