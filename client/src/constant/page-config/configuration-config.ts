import type { PageConfig } from "@/types"
import { rootConfig } from "./root-config"
import type { IconName } from "@/components/ui/icon";
import { projectConfig } from "./project-config";

const ConfigurationName: string = "Configuration";
const ConfigurationIcon: IconName = "File";
const ConfigurationPath: string = "";

export const configurationConfig: PageConfig = {
    name: ConfigurationName,
    icon: ConfigurationIcon,
    path: ConfigurationPath,
    isActive: true,
    breadcrumb: [
        rootConfig.baseBreadcrumb,
        { id: 2, label: projectConfig.name, url: projectConfig.path, icon: projectConfig.icon },
        { id: 3, label: ConfigurationName, url: ConfigurationPath, icon: ConfigurationIcon }
    ]
}