import apiClient, { API_ROUTES } from './apiClient';
import { Video, Author, Tag } from './dto';



// Fetch all admin
export const getVideo = async (): Promise<Video[]> => {
    const response = await apiClient.get<Video[]>(API_ROUTES.VIDEO);
    return response.data;
};

// Fetch a file by ID
export const getVideoById = async (id: string): Promise<Video> => {
    const response = await apiClient.get<Video>(`${API_ROUTES.VIDEO}/${id}`);
    return response.data;
};

// Create a new file
export const createVideo = async (file: Partial<Video>): Promise<Video> => {
    const response = await apiClient.post<Video>(API_ROUTES.VIDEO, file);
    return response.data;
};


// Update an existing file
export const updateVideo = async (file: Partial<Video>): Promise<Video> => {
    console.log(JSON.stringify(file));
    const response = await apiClient.put<Video>(`${API_ROUTES.VIDEO}`, file);
    return response.data;
};

// Delete a file
export const deleteVideo = async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ROUTES.VIDEO}/${id}`);
};