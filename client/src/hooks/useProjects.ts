import { useEffect } from 'react';
import { useApi } from './useApi';
import { endpoints } from '@/lib/endpoints';
import type { Project } from '@config-vault/shared';

export interface UseProjectsResult {
    projects: Project[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useProjects = (): UseProjectsResult => {
    const { data: projects, loading, error, get } = useApi<Project[]>();

    const fetchProjects = async (): Promise<void> => {
        await get(endpoints.projects.getAll, {
            includePrivateHeaders: true,
        });
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return {
        projects,
        loading,
        error,
        refetch: fetchProjects,
    };
};
