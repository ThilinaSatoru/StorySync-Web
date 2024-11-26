import apiClient from './apiClient';
import { Pdf, Author, Tag } from './dto';



const requestMapping = '/author';


// Fetch all authors
export const getAllAuthors = async (): Promise<Author[]> => {
    const response = await apiClient.get<Author[]>(requestMapping);
    return response.data;
};

// Create a new author
export const createAuthor = async (author: Partial<Author>): Promise<Author> => {
    const response = await apiClient.post<Author>(requestMapping, author);
    return response.data;
};

// Update an existing author
export const updateAuthor = async (id: string, updatedData: Partial<Author>): Promise<Author> => {
    const response = await apiClient.put<Author>(`${requestMapping}/${id}`, updatedData);
    return response.data;
};

// Delete an author by ID
export const deleteAuthor = async (id: string): Promise<void> => {
    await apiClient.delete(`${requestMapping}/${id}`);
};