import apiClient from './apiClient';
import { File, Author, Tag } from './dto';



const requestMapping = '/tag';




// Fetch all authors
export const getAllTags = async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>(requestMapping);
    return response.data;
};

// Create a new author
export const createTag = async (author: Partial<Tag>): Promise<Tag> => {
    const response = await apiClient.post<Tag>(requestMapping, author);
    return response.data;
};

// Update an existing author
export const updateTag = async (id: string, updatedData: Partial<Tag>): Promise<Tag> => {
    const response = await apiClient.put<Tag>(`${requestMapping}/${id}`, updatedData);
    return response.data;
};

// Delete an author by ID
export const deleteTag = async (id: string): Promise<void> => {
    await apiClient.delete(`${requestMapping}/${id}`);
};