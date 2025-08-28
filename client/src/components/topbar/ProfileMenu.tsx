import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Text from "../ui/text";
import { ShowAlert } from "../ui/my-alert/my-alert";
import { storage } from "@/lib/storage";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { pageConfig } from "@/constant/page-config";
import useProfileStore from "@/store/useProfileStore";
import { getInitialWords } from "@/lib/utils";

const ProfileMenu = () => {
    const navigate = useNavigate();
    const { user } = useProfileStore();
    const handleLogout = async () => {
        const confirmed = await ShowAlert({
            title: "Logout",
            description: "Are you sure you want to logout?",
            confirmText: "Logout",
            cancelText: "Cancel",
            isDangerous: true
        });

        if (confirmed) {
            storage.remove('AUTH_TOKEN')
            navigate("/login")
            toast.success("Logout Successfully")
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.avatar_url} alt="avatar" />
                    <AvatarFallback>{getInitialWords(user?.name ?? user?.username ?? "UN")}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to={pageConfig.profile.path} className="w-full cursor-pointer">
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full cursor-pointer">
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <Text className="w-full text-destructive cursor-pointer">Logout</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileMenu
