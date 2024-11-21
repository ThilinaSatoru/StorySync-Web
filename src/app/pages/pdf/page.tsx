'use client';
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getFiles } from "@/services/fileService";
import { File } from "@/services/dto";
import PdfViewerPage from '../../components/PdfViewer'
import FileGallery from './Gallery';

const page = () => {
    const [showPdf, setShowPdf] = useState(true);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fileUrl = "E:\\Downs\\kat\\kath\\Adika Kama 01.pdf";
    const BASE_API_URL = "http://localhost:8080/api/pdf";
    const basePath = "E:\\Downs\\kat\\kath\\";
    // Escape backslashes in basePath for the regular expression
    const escapedBasePath = basePath.replace(/\\/g, '\\\\');
    // Replace the base path with an empty string
    const relativePath = fileUrl.replace(new RegExp(`^${escapedBasePath}`), '');
    // const fileUrl = "E:\\Downs\\kat\\kath\\Fam Incest\\Asammathaya 01.pdf";





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

    return (
        <div>
            <FileGallery files={files} />
            {/* {showPdf && (
                <PdfViewerPage
                    fileUrl={`${BASE_API_URL}/${encodeURIComponent(relativePath)}`}
                    onClose={() => setShowPdf(false)}
                />
            )} */}
        </div>
    )
}

export default page


