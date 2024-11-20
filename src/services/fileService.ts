import apiClient from './apiClient';
import { File, Author, Tag } from './dto';


const request_mapping = '/file';



// Fetch all files
export const getFiles = async (): Promise<File[]> => {
    const response = await apiClient.get<File[]>(request_mapping);
    return response.data;
};

// Fetch a file by ID
export const getFileById = async (id: number): Promise<File> => {
    const response = await apiClient.get<File>(`${request_mapping}/${id}`);
    return response.data;
};

// Create a new file
export const createFile = async (file: Partial<File>): Promise<File> => {
    const response = await apiClient.post<File>(request_mapping, file);
    return response.data;
};


// Update an existing file

export const updateFile = async (file: Partial<File>): Promise<File> => {
    console.log(JSON.stringify(file));
    const response = await apiClient.put<File>(`${request_mapping}`, file);
    return response.data;
};

// Delete a file
export const deleteFile = async (id: number): Promise<void> => {
    await apiClient.delete(`${request_mapping}/${id}`);
};

