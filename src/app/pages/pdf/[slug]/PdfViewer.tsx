'use client';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs, DocumentProps, PageProps } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minus, Plus, RotateCw, ScanEye, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/services/apiClient';
import LoadingPage from '@/app/components/LoadingPage';
import { getFileUrlByFileName } from '@/services/pdfService'
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Import PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Shortcut Configuration Schema
const shortcutSchema = z.object({
    prevPage: z.string().min(1, "Shortcut is required"),
    nextPage: z.string().min(1, "Shortcut is required"),
    zoomIn: z.string().min(1, "Shortcut is required"),
    zoomOut: z.string().min(1, "Shortcut is required"),
    resetZoom: z.string().min(1, "Shortcut is required"),
    rotatePage: z.string().min(1, "Shortcut is required")
});


interface PdfViewerProps {
    fileName: string;
    apiUrl?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
    fileName,
    apiUrl = 'http://localhost:8080/api/pdf/file?fileName='
}) => {
    const router = useRouter();
    // const [pdfFile, setPdfFile] = useState<string | { url: string }>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const BASE_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.PDF}`;
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [isConfigOpen, setIsConfigOpen] = useState(false);


    const [pdfFile, setPdfFile] = useState<string | { url: string }>("");

    // apiUrl = 'http://localhost:8080/api/pdf/file?fileName='
    useEffect(() => {
        const fetchPDF = async () => {
            try {
                // Use responseType to ensure correct handling of binary data
                const response = await axios.get(`${apiUrl}${fileName}`, {
                    responseType: 'arraybuffer', // Use arraybuffer instead of blob
                    headers: {
                        'Accept': 'application/pdf'
                    }
                });

                // Create Blob from ArrayBuffer
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                console.log('PDF File URL:', fileURL);

                setPdfFile({ url: fileURL });
            } catch (err) {
                console.error('Error fetching PDF:', err);

                // More detailed error handling
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        // The request was made and the server responded with a status code
                        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
                    } else if (err.request) {
                        // The request was made but no response was received
                        setError('No response received from server');
                    } else {
                        // Something happened in setting up the request
                        setError('Error setting up the request');
                    }
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchPDF();

        // Cleanup to revoke object URL
        return () => {
            if (typeof pdfFile === 'object' && 'url' in pdfFile) {
                URL.revokeObjectURL(pdfFile.url);
            }
        };
    }, [fileName, apiUrl]);


    // Default shortcuts
    const [shortcuts, setShortcuts] = useState({
        prevPage: 'ArrowLeft',
        nextPage: 'ArrowRight',
        zoomIn: 'Ctrl+ArrowRight',
        zoomOut: 'Ctrl+ArrowLeft',
        resetZoom: 'Ctrl+0',
        rotatePage: 'Ctrl+r'
    });

    const form = useForm<z.infer<typeof shortcutSchema>>({
        resolver: zodResolver(shortcutSchema),
        defaultValues: shortcuts
    });

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setLoading(false);
        setNumPages(numPages);
    };

    const changePage = (offset: number) => {
        scrollToTop();
        setPageNumber(prevPageNumber =>
            Math.max(1, Math.min(prevPageNumber + offset, numPages || 1))
        );
    };

    const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 2));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => setScale(1);
    const rotatePage = () => setRotation((prev) => (prev + 90) % 360);

    // Keyboard event handler with configurable shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;
            const modifiers = {
                ctrl: event.ctrlKey,
                alt: event.altKey,
                shift: event.shiftKey
            };

            const matchShortcut = (shortcut: string) => {
                const parts = shortcut.toLowerCase().split('+');
                return parts.every(part => {
                    switch (part) {
                        case 'ctrl': return modifiers.ctrl;
                        case 'alt': return modifiers.alt;
                        case 'shift': return modifiers.shift;
                        default: return key.toLowerCase() === part;
                    }
                });
            };

            if (matchShortcut(shortcuts.prevPage)) changePage(-1);
            if (matchShortcut(shortcuts.nextPage)) changePage(1);
            if (matchShortcut(shortcuts.zoomIn)) zoomIn();
            if (matchShortcut(shortcuts.zoomOut)) zoomOut();
            if (matchShortcut(shortcuts.resetZoom)) resetZoom();
            if (matchShortcut(shortcuts.rotatePage)) rotatePage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts, numPages]);

    const onSubmit = (data: z.infer<typeof shortcutSchema>) => {
        setShortcuts(data);
        setIsConfigOpen(false);
    };

    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js
    function scrollToTop() {
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handlerOnClose = () => {
        router.push("/pages/pdf")
    }

    const documentProps: DocumentProps = {
        file: pdfFile,
        onLoadSuccess: onDocumentLoadSuccess,

    };

    const pageProps: PageProps = {
        pageNumber: pageNumber,
        width: 800,
        renderTextLayer: false,
        renderAnnotationLayer: false,
    };

    if (error) {
        return (
            <div className="error-container">
                <p>Error loading PDF:</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center min-h-screen p-4">
            <button
                onClick={handlerOnClose}
                className="absolute p-2 text-white bg-red-500 rounded-full top-4 right-4">
                <X />
            </button>

            <div className="flex items-center mb-4 space-x-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                    className="p-2 text-white bg-blue-500 rounded disabled:opacity-50"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <span>Page {pageNumber} of {numPages || '...'}</span>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= (numPages || 1)}
                    className="p-2 text-white bg-blue-500 rounded disabled:opacity-50"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>

                    <Button
                        size="icon"
                        onClick={resetZoom}
                    // className="p-2 text-white bg-green-500 rounded"
                    >
                        <ScanEye className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={zoomIn}
                        disabled={scale >= 2}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    {/* <Button
                        variant="outline"
                        onClick={() => setIsConfigOpen(true)}
                    >
                        Configure Shortcuts
                    </Button> */}
                </div>
            </div>

            <div className="max-w-full overflow-auto">
                <Document {...documentProps}>
                    <Page
                        {...pageProps}
                        scale={scale}
                        angle={rotation}
                    />
                </Document>
            </div>

            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configure Keyboard Shortcuts</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="prevPage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Previous Page</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. ArrowLeft" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nextPage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Next Page</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. ArrowRight" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zoomIn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zoom In</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Ctrl+ArrowRight" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zoomOut"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zoom Out</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Ctrl+ArrowLeft" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="resetZoom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reset Zoom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Ctrl+0" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rotatePage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rotate Page</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Ctrl+r" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Save Shortcuts</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PdfViewer;

