const API_BASE_URL = import.meta.env.VITE_BASE_API_URL ?? 'http://localhost:4000/api';

export const endpoints = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
    },

    users: {
        getAll: `${API_BASE_URL}/users`,
        getById: (id: string) => `${API_BASE_URL}/users/${id}`,
        getCurrent: `${API_BASE_URL}/users/profile`,
        create: `${API_BASE_URL}/users`,
        update: (id: string) => `${API_BASE_URL}/users/${id}`,
        delete: (id: string) => `${API_BASE_URL}/users/${id}`,
    }
};