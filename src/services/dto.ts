export interface Tag {
    id: number;
    name: string;
    createdAt: string;
    pdfFiles: any[]; // Adjust type as needed if `pdfFiles` structure is defined
}

export interface Author {
    id: number;
    name: string;
    createdAt: string;
    pdfFiles: any[]; // Adjust type as needed
}

export interface File {
    id: number;
    filePath: string;
    fileName: string;
    folderName: string;
    cover: string | null;
    fileType: string;
    language: string | null;
    lastModified: string;
    createdAt: string;
    tags: Tag[];
    authors: Author[];
}