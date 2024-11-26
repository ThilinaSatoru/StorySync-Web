export interface Tag {
    id: number;
    name: string;
}

export interface Author {
    id: number;
    name: string;
}

export interface Pdf {
    id: number;
    filePath: string;
    fileName: string;
    folderName: string;
    fileSize: number;
    language: string | null;
    createdTime: string;
    modifiedTime: string;
    pageCount: number;
    title: string;
    author: string;

    thumbnail: string | null;

    tags: Tag[];
    authors: Author[];
}


export interface Video {
    id: number;
    filePath: string;
    fileName: string;
    folderName: string;
    sizeBytes: number;
    createdTime: string;
    modifiedTime: string;
    duration: number;
    resolution: string;
    format: string;
    checksum: string;
    thumbnailUrl: string;
    thumbnailPath: string;
    previewPath: string;

    tags: Tag[];
    authors: Author[];
}