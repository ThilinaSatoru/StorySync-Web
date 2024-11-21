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
    filepath: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ filepath }) => {
    const router = useRouter();
    const BASE_API_URL = "http://localhost:8080/api/pdf";
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const fileUrl = `${BASE_API_URL}/${filepath}`;
    console.info(fileUrl);

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

    const documentProps: DocumentProps = {
        file: fileUrl,
        onLoadSuccess: onDocumentLoadSuccess,
    };

    const pageProps: PageProps = {
        pageNumber: pageNumber,
        width: 800,
        renderTextLayer: false,
        renderAnnotationLayer: false,
    };

    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js
    function scrollToTop() {
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handlerOnClose = () => {
        router.push("/pages/pdf")
    }

    return (
        <div className="flex flex-col items-center p-4 min-h-screen relative">
            <button
                onClick={handlerOnClose}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full">
                <X />
            </button>

            <div className="flex items-center space-x-4 mb-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                    className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <span>Page {pageNumber} of {numPages || '...'}</span>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= (numPages || 1)}
                    className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <Button
                        size="icon"
                        onClick={resetZoom}
                    // className="p-2 bg-green-500 text-white rounded"
                    >
                        <ScanEye className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={zoomIn}
                        disabled={scale >= 2}
                    >
                        <Plus className="h-4 w-4" />
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
