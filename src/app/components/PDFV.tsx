//PDFViewer.tsx
'use client';

import { useState } from 'react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
// Import the worker from the public directory
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
    fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => {
        if (pageNumber > 1) changePage(-1);
    };

    const nextPage = () => {
        if (pageNumber < (numPages || 0)) changePage(1);
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
    };

    return (
        <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Page Navigation */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={previousPage}
                            disabled={pageNumber <= 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {pageNumber} of {numPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={pageNumber >= (numPages || 0)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={zoomOut}
                            disabled={scale <= 0.5}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Zoom Out
                        </button>
                        <span className="text-sm">
                            {(scale * 100).toFixed(0)}%
                        </span>
                        <button
                            onClick={zoomIn}
                            disabled={scale >= 2.0}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Zoom In
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center h-96">
                                <div className="text-xl text-gray-500">Loading PDF...</div>
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center h-96">
                                <div className="text-xl text-red-500">
                                    Error loading PDF! Please check if the file exists.
                                </div>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="max-w-full"
                        />
                    </Document>
                </div>
            </div>
        </>
    );
}