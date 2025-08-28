import type { PageConfig } from "@/types"
import { rootConfig } from "./root-config"
import type { IconName } from "@/components/ui/icon";

const dashboardName: string = "Dashboard";
const dashboardIcon: IconName = "LayoutDashboard";
const path: string = "/";

export const dashboardConfig: PageConfig = {
    name: dashboardName,
    icon: dashboardIcon,
    path: path,
    isActive: true,
    breadcrumb: [
        rootConfig.baseBreadcrumb,
        { id: 2, label: dashboardName, url: path, icon: dashboardIcon }
    ]
}