import type { BreadcrumbData } from "@/components/core/MyBreadcrumb"

interface RootConfig {
    baseBreadcrumb: BreadcrumbData
}
export const rootConfig: RootConfig = {
    baseBreadcrumb: { id: 1, label: "Home", url: "/", icon: "Home" }
}