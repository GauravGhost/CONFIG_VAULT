import type { IconName } from "@/components/ui/icon";
import { dashboardConfig } from "@/constant/page-config/dashboard-config";
import { useProjects } from "@/hooks/useProjects";
import { useMemo } from "react";

interface MenuItem {
    title: string;
    url: string;
    icon?: IconName;
    permissionId?: string;
    isActive?: boolean;
    children?: MenuItem[];
}

export const useSidebarItems = (): MenuItem[] => {
    const { projects, loading } = useProjects();

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
            children: loading ? [
                {
                    title: "Loading...",
                    url: "#",
                    icon: "Loader",
                    isActive: false,
                }
            ] : projects?.map(project => ({
                title: project.name,
                url: `/projects/${project.id}`,
                icon: project.is_active ? "Folder" : "FolderX",
                isActive: project.is_active,
            })) || []
        }
    ], [projects, loading]);

    return sidebarItems;
};
