import type { IconName } from "@/components/ui/icon";
import { dashboardConfig } from "@/constant/page-config/dashboard-config";

interface MenuItem {
    title: string;
    url: string;
    icon?: IconName;
    permissionId?: string;
    isActive?: boolean;
    children?: MenuItem[];
}

export const sidebarItems: MenuItem[] = [
    {
        title: dashboardConfig.name,
        url: dashboardConfig.path,
        icon: dashboardConfig.icon,
        isActive: true,
    },
];
