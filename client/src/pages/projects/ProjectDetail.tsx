import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { endpoints } from '@/lib/endpoints';
import type { Project } from '@config-vault/shared';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const { data, loading, error, get } = useApi<Project>();

    useEffect(() => {
        if (id) {
            get(endpoints.projects.getById(id), {
                includePrivateHeaders: true,
            });
        }
    }, [id, get]);

    useEffect(() => {
        if (data) {
            setProject(data);
        }
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading project...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Project not found</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {project.name}
                </h1>
                {project.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {project.description}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Project Details</h2>
                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">ID:</span> {project.id}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span>{' '}
                            <span className={project.is_active ? 'text-green-600' : 'text-red-600'}>
                                {project.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Created:</span>{' '}
                            {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Updated:</span>{' '}
                            {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Configurations</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Configuration management for this project will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    );
}
