import type { PageConfig } from "@/types"
import { rootConfig } from "./root-config"
import type { IconName } from "@/components/ui/icon";

const profileName: string = "Profile";
const profileIcon: IconName = "User2";
const profilePath: string = "/profile";

export const profileConfig: PageConfig = {
    name: profileName,
    icon: profileIcon,
    path: profilePath,
    isActive: true,
    breadcrumb: [
        rootConfig.baseBreadcrumb,
        { id: 2, label: profileName, url: profilePath, icon: profileIcon }
    ]
}