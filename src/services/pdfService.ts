import apiClient, { API_ROUTES } from './apiClient';
import { Pdf, Author, Tag } from './dto';



// Fetch all admin
export const getFiles = async (): Promise<Pdf[]> => {
    const response = await apiClient.get<Pdf[]>(API_ROUTES.PDF);
    return response.data;
};

// Fetch a file by ID
export const getFileById = async (id: string): Promise<Pdf> => {
    const response = await apiClient.get<Pdf>(`${API_ROUTES.PDF}/${id}`);
    return response.data;
};

// {{base_url}}/api/pdf/file?fileName=E%3A%5C%5CDowns%5C%5Cbase%5C%5Ccontent%5C%5Cpdf%5C%5Cmilf%5C%5CAluth%20Teacher%20Aunty.pdf
export const getFileUrlByFileName = async (filePath: string): Promise<string> => {
    const response = await apiClient.get<string>(`${API_ROUTES.PDF}/file?fileName=${encodeURIComponent(filePath)}`);
    return response.data;
};

// Create a new file
export const createFile = async (file: Partial<Pdf>): Promise<Pdf> => {
    const response = await apiClient.post<Pdf>(API_ROUTES.PDF, file);
    return response.data;
};


// Update an existing file

export const updateFile = async (file: Partial<Pdf>): Promise<Pdf> => {
    console.log(JSON.stringify(file));
    const response = await apiClient.put<Pdf>(`${API_ROUTES.PDF}`, file);
    return response.data;
};

// Delete a file
export const deleteFile = async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ROUTES.PDF}/${id}`);
};

