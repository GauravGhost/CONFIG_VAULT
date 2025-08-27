import {
    NavigationMenu,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import ProfileMenu from "../topbar/ProfileMenu"
import { SidebarTrigger } from "../ui/sidebar"
import { ModeToggle } from "../mode-toggle";

function AppTopbar() {

    return (
        <div className="flex justify-between items-center w-full px-4 py-2 bg-sidebar">
            <NavigationMenu>
                <NavigationMenuList>
                    <SidebarTrigger />
                </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
                <NavigationMenuList>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <ProfileMenu />
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default AppTopbar;