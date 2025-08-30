import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { endpoints } from '@/lib/endpoints';
import type { Project } from '@config-vault/shared';
import { projectConfig } from '@/constant/page-config/project-config';
import SectionWrapper from '@/components/core/wrapper/SectionWrapper';
import { configurationConfig } from '@/constant/page-config/configuration-config';
const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error, get } = useApi<Project>();

    useEffect(() => {
        if (id) {
            get(endpoints.projects.getById(id), {
                includePrivateHeaders: true,
            });
        }
    }, [id, get]);



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

    if (!data) {
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
                    {data.name}
                </h1>
                {data.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {data.description}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Project Details</h2>
                    <div className="space-y-2">
                        <div>
                            <span className="font-medium">ID:</span> {data.id}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span>{' '}
                            <span className={data.is_active ? 'text-green-600' : 'text-red-600'}>
                                {data.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Created:</span>{' '}
                            {data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                            <span className="font-medium">Updated:</span>{' '}
                            {data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'N/A'}
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

export default SectionWrapper(configurationConfig.name, ProjectDetail, configurationConfig.breadcrumb);