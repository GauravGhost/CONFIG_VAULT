import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ShowAlert } from "@/components/ui/my-alert/my-alert";
import { colorTheme } from "@/constant/enums";
import { usePrivateDeleteApi, usePrivateGetApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import useProjectsStore from "@/store/useProjectsStore";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ManageProject from "../ManageProject";
import { Loader } from "@/components/ui/loader";
import { type Project } from "@config-vault/shared";

const ConfigurationActionButton = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const { refreshProjects, getProjects } = useProjectsStore();
    const projectApi = usePrivateDeleteApi();
    
    const handleDelete = async () => {
        const confirmed = await ShowAlert({
            title: "Delete Project",
            description: "Are you sure you want to delete this project? This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            isDangerous: true,
        });
        if (confirmed && id) {
            await projectApi.deleteData(endpoints.projects.delete(id));
            if (projectApi.error) {
                toast.error(projectApi.error ?? "Something went wrong");
            } else {
                await refreshProjects();
                const projects = await getProjects();
                if (projects && projects.length > 0) {
                    navigate(`/projects/${projects[0]?.id}`);
                } else {
                    navigate(`/projects/create`);
                }
                toast.success("Project deleted successfully");
            }
        }
    };

    const [project, setProject] = useState<Project | null>(null);

    // Fetch project when modal opens or id changes
    const fetchProject = async () => {
        if (id) {
            const projects = await getProjects();
            if (projects && projects.length > 0) {
                setProject(projects.find((p: Project) => p.id === id) ?? null);
            } else {
                setProject(null);
            }
        }
    };

    // When modal opens, fetch latest project
    useEffect(() => {
        if (isEditing) {
            fetchProject();
        }
    }, [isEditing, id]);

    // Also fetch on mount for initial load
    useEffect(() => {
        fetchProject();
    }, [id]);

    if (!id || !project) {
        return <Loader fullScreen />;
    }

    return (
        <div className='flex gap-4 items-center'>
            <Button
                variant="outline"
                onClick={() => navigate(`/projects/${id}/configuration/create`)}
            >
                <Icon name='Plus' />
            </Button>
            <ManageProject data={project} open={isEditing} onOpenChange={setIsEditing} />
            <Button variant={"outline"} onClick={handleDelete}>
                <Icon name='Trash' className={colorTheme.red.text} />
            </Button>
        </div>
    );
};

export default ConfigurationActionButton;