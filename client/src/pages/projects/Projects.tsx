import { Link } from 'react-router';
import { useProjects } from '@/hooks/useProjects';

export default function Projects() {
    const { projects, loading, error, refetch } = useProjects();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">
                    Error: {error}
                    <button 
                        onClick={refetch}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Projects
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Manage your configuration projects
                </p>
            </div>

            {!projects || projects.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">
                        No projects found. Create your first project to get started.
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                    {project.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    project.is_active 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                    {project.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
