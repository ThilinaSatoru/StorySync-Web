'use client';
import React, { useEffect, useState, useCallback } from "react";
import { getFiles } from "@/services/pdfService";
import { Pdf } from "@/services/dto";
import FileGallery from './FileGallery';
import LoadingPage from "@/app/components/LoadingPage";

const page = () => {
    const [files, setFiles] = useState<Pdf[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            {!loading ? <>

                <FileGallery files={files} />
            </> : <>
                <div><LoadingPage /></div>
            </>}

        </div>
    )
}

export default page


