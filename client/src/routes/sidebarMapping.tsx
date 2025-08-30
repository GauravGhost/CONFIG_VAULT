import type { IconName } from "@/components/ui/icon";
import { dashboardConfig } from "@/constant/page-config/dashboard-config";
import { usePrivateGetApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import useProjectsStore from "@/store/useProjectsStore";
import { type Project } from "@config-vault/shared";
import { useEffect, useMemo } from "react";

interface MenuItem {
    title: string;
    url: string;
    icon?: IconName;
    permissionId?: string;
    isActive?: boolean;
    children?: MenuItem[];
}

export const useSidebarItems = (): MenuItem[] => {
    const {setProjects, projects} = useProjectsStore();
    const { loading, data } = usePrivateGetApi<Project[]>(endpoints.projects.getAll)

    useEffect(() => {
        if (!loading && data) {
            setProjects(data);
        }
    }, [loading, data, setProjects]);
    
    const sidebarItems: MenuItem[] = useMemo(() => [
        {
            title: dashboardConfig.name,
            url: dashboardConfig.path,
            icon: dashboardConfig.icon,
            isActive: true,
        },
        {
            title: "Projects",
            url: "/projects",
            icon: "FolderOpen",
            isActive: true,
            children: [
                {
                    title: "Create New Project",
                    url: "/projects/create",
                    icon: "PlusCircle",
                    isActive: true,
                },
                ...(loading ? [
                    {
                        title: "Loading...",
                        url: "#",
                        icon: "Loader" as IconName,
                        isActive: false,
                    }
                ] : projects?.map(project => ({
                    title: project.name,
                    url: `/projects/${project.id}`,
                    icon: (project.is_active ? "Folder" : "FolderX") as IconName,
                    isActive: project.is_active,
                })) || [])
            ]
        }
    ], [projects, loading]);

    return sidebarItems;
};
