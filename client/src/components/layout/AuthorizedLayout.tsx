import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/core/AppSidebar"
import MobileSidebarToggle from "@/components/core/MobileSidebarToggle"
import { Outlet } from "react-router"
import { PrivateRoute } from "../core/wrapper/PrivateRouteWrapper"

export default function AuthorizedLayout() {
    return (
        <PrivateRoute>
            <SidebarProvider>
                <nav>
                    <AppSidebar />
                </nav>
                <SidebarInset>
                    <main>
                        <Outlet />
                    </main>
                </SidebarInset>
                <MobileSidebarToggle 
                    draggable={true}
                    placement="bottom-left"
                    offset={24}
                />
            </SidebarProvider>
        </PrivateRoute>
    )
}
