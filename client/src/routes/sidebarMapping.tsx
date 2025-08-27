import type { IconName } from "@/components/ui/icon";

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
        title: "Dashboard",
        url: "/",
        icon: "LayoutDashboard",
        isActive: true,
    },
];
