import type { BreadcrumbData } from "@/components/core/MyBreadcrumb"
import type { PageConfig } from "@/types"

const sidebarBaseBreadcrumb: BreadcrumbData = { id: 1, label: "Dashboard", url: "/", icon: "LayoutDashboard" }

export const dashboardConfig: PageConfig = {
    name: "Dashboard",
    icon: "LayoutDashboard",
    path: "/",
    isActive: true,
    breadcrumb: [
        sidebarBaseBreadcrumb,
    ]
}