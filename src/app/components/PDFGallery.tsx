import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getFiles } from "@/services/pdfService";
import { Pdf } from "@/services/dto";
import PDFV from "./PDFV"
import PdfViewer from "./PdfViewer";

const PDFGallery = () => {
    const [files, setFiles] = useState<Pdf[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const defaultFile: Pdf = {
        id: 0,
        filePath: '',
        fileName: '',
        folderName: '',
        cover: null,
        fileType: 'unknown',
        language: null,
        lastModified: '',
        createdAt: '',
        tags: [],
        authors: []
    };

    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getFiles();

            if (data && data.length > 0) {
                setFiles(data);
            } else {
                setError("No admin found");
            }
        } catch (error) {
            console.error("Error fetching admin:", error);
            setError("Failed to load admin");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Filter PDF admin
    const pdfFiles = useMemo(() =>
        files.filter(file => file.fileType === 'pdf'),
        [files]
    );

    const pdfFile = useMemo(() => {
        return files.find(file => file.fileType === 'pdf') || defaultFile;
    }, [files]);

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">Loading files...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                <p>{error}</p>
                <button
                    onClick={fetchFiles}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Render admin or empty state
    return (
        <div className="container mx-auto p-4">
            {pdfFiles.length > 0 && pdfFiles != undefined ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        // pdfFiles.map((file) => (
                        //     <PDFComicViewer
                        //         key={file.id}
                        //         file={file}
                        //     />
                        // ))

                        // < PdfViewer
                        //     file={pdfFile}
                        // />

                        // <PDFV fileUrl={pdfFile.filePath} />
                    }
                </div>
            ) : (
                <div className="text-center text-gray-500 p-8">
                    <p>No PDF files found</p>
                </div>
            )}
        </div>
    );
}

export default React.memo(PDFGallery);