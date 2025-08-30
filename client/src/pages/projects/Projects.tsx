import { Link, useNavigate } from 'react-router';
import { useProjects } from '@/hooks/useProjects';
import SectionWrapper from '@/components/core/wrapper/SectionWrapper';
import { projectConfig } from '@/constant/page-config/project-config';

const Projects = () => {
    const { projects, loading, error, refetch } = useProjects();
    const navigate = useNavigate();

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
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Projects
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Manage your configuration projects
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/projects/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                    >
                        <span className="text-lg">+</span>
                        <span className="hidden sm:inline">Create New Project</span>
                        <span className="sm:hidden">New Project</span>
                    </button>
                </div>
            </div>

            {!projects || projects.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-500 dark:text-gray-400 mb-6">
                        <div className="text-4xl sm:text-6xl mb-4">📁</div>
                        <div className="text-base sm:text-lg">
                            No projects found. Create your first project to get started.
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/projects/create')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                    >
                        <span className="text-lg">+</span>
                        <span>Create Your First Project</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="block p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                    {project.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    project.is_active 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                    {project.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
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

export default SectionWrapper(projectConfig.name, Projects, projectConfig.breadcrumb);