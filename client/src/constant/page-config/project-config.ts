import type { PageConfig } from "@/types"
import { rootConfig } from "./root-config"
import type { IconName } from "@/components/ui/icon";

const projectName: string = "Project";
const projectIcon: IconName = "Folder";
const projectPath: string = "/project";

export const projectConfig: PageConfig = {
    name: projectName,
    icon: projectIcon,
    path: projectPath,
    isActive: true,
    breadcrumb: [
        rootConfig.baseBreadcrumb,
        { id: 2, label: projectName, url: projectPath, icon: projectIcon }
    ]
}

export const newProjectConfig: PageConfig = {
    name: `New ${projectName}`,
    icon: projectIcon,
    path: `${projectPath}/create`,
    isActive: true,
    breadcrumb: [
        rootConfig.baseBreadcrumb,
        { id: 2, label: projectName, url: projectPath, icon: projectIcon },
        { id: 3, label: `New ${projectName}`, url: `${projectPath}/create`, icon: projectIcon }
    ]
};