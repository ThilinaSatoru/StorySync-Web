// types/react-pdf.d.ts
declare module 'react-pdf' {
    import { ComponentType, ReactElement } from 'react';

    export interface DocumentProps {
        file: string | { url: string } | { data: string };
        onLoadSuccess?: (pdf: { numPages: number }) => void;
        loading?: ReactElement;
        error?: ReactElement;
        children?: ReactElement;
    }

    export interface PageProps {
        pageNumber: number;
        width: number;
        scale?: number;
        angle?: number;
        renderTextLayer?: boolean;
        renderAnnotationLayer?: boolean;
        className?: string;
    }

    export const Document: ComponentType<DocumentProps>;
    export const Page: ComponentType<PageProps>;
    export const pdfjs: {
        GlobalWorkerOptions: {
            workerSrc: string;
        };
        version: string;
    };
}