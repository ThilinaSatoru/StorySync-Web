import apiClient from './apiClient';

export interface User {
    id: number;
    name: string;
    email: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
};
