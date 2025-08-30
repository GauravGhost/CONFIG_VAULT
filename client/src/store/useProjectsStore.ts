import { endpoints } from '@/lib/endpoints';
import type { Project } from '@config-vault/shared';
import { create } from 'zustand';
import axios from 'axios';
import { getPrivateHeaders } from '@/hooks/useApi';

interface ProjectState {
    projects: Project[] | null;
    getProjects: () => Promise<Project[] | null>;
    setProjects: (projects: Project[] | null) => void;
    refreshProjects: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const useProjectsStore = create<ProjectState>((set, get) => ({
    projects: null,
    isLoading: false,
    error: null,
    
    getProjects: async () => {
        const projects = get().projects;
        if (projects) {
            return projects;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(endpoints.projects.getAll, {
                headers: getPrivateHeaders()
            });
            
            const fetchedProjects = response.data?.data || response.data;
            set({ projects: fetchedProjects, isLoading: false });
            return fetchedProjects;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch projects';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },
    
    setProjects: (projects: Project[] | null) => set({ projects }),
    
    refreshProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(endpoints.projects.getAll, {
                headers: getPrivateHeaders()
            });
            
            const fetchedProjects = response.data?.data || response.data;
            set({ projects: fetchedProjects, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh projects';
            set({ error: errorMessage, isLoading: false });
        }
    }
}));

export default useProjectsStore;