import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/core/AppSidebar"
import { Outlet } from "react-router"
import { PrivateRoute } from "../core/wrapper/PrivateRouteWrapper"
import AppTopbar from "../core/AppTopbar"

export default function AuthorizedLayout() {
    return (
        <PrivateRoute>
            <SidebarProvider>
                <nav>
                    <AppSidebar />
                </nav>
                <SidebarInset>
                    <main>
                        <AppTopbar />
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </PrivateRoute>
    )
}
