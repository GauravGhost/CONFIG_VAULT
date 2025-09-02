import type { IconName } from "@/components/ui/icon";
import { dashboardConfig } from "@/constant/page-config/dashboard-config";
import { pageConfig } from "@/constant/page-config";
import { usePrivateGetApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import useProjectsStore from "@/store/useProjectsStore";
import { type Project } from "@config-vault/shared";
import { useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ShowAlert } from "@/components/ui/my-alert/my-alert";
import { useTheme } from "@/components/theme-provider";

interface MenuItem {
    title: string;
    url: string;
    icon?: IconName;
    permissionId?: string;
    isActive?: boolean;
    children?: MenuItem[];
    onClick?: () => void | Promise<void>;
    className?: string;
}

interface FooterAction {
    title: string;
    icon: IconName;
    onClick: () => void | Promise<void>;
    className?: string;
    variant?: "default" | "destructive";
}

export const useSidebarItems = (): { sidebarItems: MenuItem[], footerActions: FooterAction[] } => {
    const {setProjects, projects} = useProjectsStore();
    const { loading, data } = usePrivateGetApi<Project[]>(endpoints.projects.getAll);
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (!loading && data) {
            setProjects(data);
        }
    }, [loading, data, setProjects]);

    const handleLogout = useCallback(async () => {
        const confirmed = await ShowAlert({
            title: "Logout",
            description: "Are you sure you want to logout?",
            confirmText: "Logout",
            cancelText: "Cancel",
            isDangerous: true,
        });

        if (confirmed) {
            storage.remove("AUTH_TOKEN");
            navigate("/login");
            toast.success("Logout Successfully");
        }
    }, [navigate]);

    const handleThemeToggle = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);
    
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
        },
        {
            title: "Settings",
            url: "#",
            icon: "Settings",
            isActive: true,
            children: [
                {
                    title: pageConfig.profile.name,
                    url: pageConfig.profile.path,
                    icon: pageConfig.profile.icon,
                    isActive: pageConfig.profile.isActive,
                }
            ]
        }
    ], [projects, loading]);

    const footerActions: FooterAction[] = useMemo(() => [
        {
            title: theme === "dark" ? "Light Mode" : "Dark Mode",
            icon: theme === "dark" ? "Sun" : "Moon",
            onClick: handleThemeToggle,
        },
        {
            title: "Logout",
            icon: "LogOut",
            onClick: handleLogout,
            variant: "destructive",
        }
    ], [theme, handleThemeToggle, handleLogout]);

    return { sidebarItems, footerActions };
};
