import type { BreadcrumbData } from "@/components/core/MyBreadcrumb";
import type { IconName } from "@/components/ui/icon";

export interface PageConfig {
    name: string;
    icon: IconName;
    path: string;
    breadcrumb: BreadcrumbData[];
}
