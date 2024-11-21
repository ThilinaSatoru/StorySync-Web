import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getFiles } from "@/services/fileService";
import { getAllTags } from '@/services/tagService';
import { getAllAuthors } from '@/services/authorService';
import { File, Author, Tag } from "@/services/dto";
import UpdateFileForm from "./fileForm";
import TableSkeleton from "@/app/skeletons/files-tbody";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { MultiSelect } from "@/app/components/multi-select";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";

const FileTable = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Filter states
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [allAuthors, setAllAuthors] = useState<Author[]>([]);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);


    // Filter states
    const [filterFileName, setFilterFileName] = useState<string>("");
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);





    // Transform tags to options
    const tagOptions = useMemo(() =>
        allTags.map(tag => ({
            value: tag.id.toString(),
            label: tag.name,
            icon: Cat // You can customize icons as needed
        })),
        [allTags]
    );

    // Transform authors to options
    const authorOptions = useMemo(() =>
        allAuthors.map(author => ({
            value: author.id.toString(),
            label: author.name,
            icon: Dog // You can customize icons as needed
        })),
        [allAuthors]
    );


    // Fetch tags and authors
    const fetchFiltersData = useCallback(async () => {
        try {
            const [tagsData, authorsData] = await Promise.all([
                getAllTags(),
                getAllAuthors()
            ]);
            setAllTags(tagsData);
            setAllAuthors(authorsData);
        } catch (error) {
            console.error("Error fetching filter data:", error);
        }
    }, []);

    // Filtered Files Logic
    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            const matchFileName = !filterFileName ||
                file.fileName.toLowerCase().includes(filterFileName.toLowerCase());

            const matchTags = selectedTags.length === 0 ||
                selectedTags.some(tagId =>
                    file.tags.some(fileTag => fileTag.id.toString() === tagId)
                );

            const matchAuthors = selectedAuthors.length === 0 ||
                selectedAuthors.some(authorId =>
                    file.authors.some(fileAuthor => fileAuthor.id.toString() === authorId)
                );

            return matchFileName && matchTags && matchAuthors;
        });
    }, [files, filterFileName, selectedTags, selectedAuthors]);

    // Initial data fetch
    useEffect(() => {
        fetchFiltersData();
    }, [fetchFiltersData]);

    // Paginated admin
    const paginatedFiles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredFiles.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredFiles, currentPage, itemsPerPage]);

    // Total pages calculation
    const totalPages = useMemo(() =>
        Math.ceil(filteredFiles.length / itemsPerPage),
        [filteredFiles, itemsPerPage]
    );

    // Fetch admin with useCallback to prevent unnecessary re-renders
    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getFiles();
            setFiles(data);
            setCurrentPage(1); // Reset to first page on new data
        } catch (error) {
            console.error("Error fetching admin:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Handle edit success
    const handleEditSuccess = () => {
        setSelectedFile(null);
        fetchFiles();
    };

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilterFileName("");
        setSelectedTags([]);
        setSelectedAuthors([]);
        setCurrentPage(1);
    };

    // Edit file handler
    const handleEditClick = (file: File) => {
        setSelectedFile(file);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
                <div className="w-full md:flex-1">
                    <Input
                        placeholder="Filter by File Name"
                        value={filterFileName}
                        onChange={(e) => setFilterFileName(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="w-full md:flex-1">
                    <MultiSelect
                        options={tagOptions}
                        onValueChange={setSelectedTags}
                        defaultValue={selectedTags}
                        placeholder="Select Tags"
                        variant="inverted"
                        animation={0}
                        maxCount={3}
                    />
                </div>

                <div className="w-full md:flex-1">
                    <MultiSelect
                        options={authorOptions}
                        onValueChange={setSelectedAuthors}
                        defaultValue={selectedAuthors}
                        placeholder="Select Authors"
                        variant="inverted"
                        animation={0}
                        maxCount={3}
                    />
                </div>

                <div>
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full md:w-auto"
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Files Table */}
            <Table className="border rounded-md">
                <TableHeader>
                    <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>File Type</TableHead>
                        <TableHead>Folder Name</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {!loading ? (
                    <>
                        <TableBody>
                            {paginatedFiles.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell>
                                        <span className="font-medium">{file.fileName}</span>
                                    </TableCell>
                                    <TableCell>{file.fileType}</TableCell>
                                    <TableCell>{file.folderName}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {file.tags.map((tag) => (
                                                <Badge key={tag.id} variant="outline">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {file.authors.map((author) => (
                                                <Badge key={author.id} variant="secondary">
                                                    {author.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Dialog
                                                open={selectedFile?.id === file.id}
                                                onOpenChange={(open) => !open && setSelectedFile(null)}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEditClick(file)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit File</DialogTitle>
                                                    </DialogHeader>
                                                    {selectedFile && (
                                                        <UpdateFileForm
                                                            fileData={selectedFile}
                                                            onUpdateSuccess={handleEditSuccess}
                                                        />
                                                    )}
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => console.log("Delete file:", file)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                ) : (
                    <TableSkeleton />
                )}
            </Table>

            {/* Pagination */}
            {!loading && filteredFiles.length > 0 && (
                <Pagination className="overflow-x-auto">
                    <PaginationContent className="inline-flex items-center gap-1">
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                                isActive={currentPage > 1}
                            />
                        </PaginationItem>

                        {totalPages <= 5 ? (
                            [...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={`simple-page-${index + 1}`}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(index + 1);
                                        }}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                        ) : (
                            <>
                                {currentPage > 2 && (
                                    <PaginationItem key="first-page">
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(1);
                                            }}
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                {currentPage > 3 && <PaginationItem key="first-ellipsis">...</PaginationItem>}

                                {[
                                    Math.max(1, currentPage - 1),
                                    currentPage,
                                    Math.min(totalPages, currentPage + 1)
                                ].map((page, index) => (
                                    page > 0 && page <= totalPages && (
                                        <PaginationItem key={`context-page-${page}-${index}`}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(page);
                                                }}
                                                isActive={currentPage === page}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                ))}

                                {currentPage < totalPages - 2 && <PaginationItem key="last-ellipsis">...</PaginationItem>}
                                {currentPage < totalPages - 1 && (
                                    <PaginationItem key="last-page">
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(totalPages);
                                            }}
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                            </>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                }}
                                isActive={currentPage < totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default FileTable;