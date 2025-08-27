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
import { useNavigate } from "react-router";
import { toast } from "sonner";

const ProfileMenu = () => {
    const navigate = useNavigate();
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
                    <AvatarImage src="" alt="avatar" />
                    <AvatarFallback>WN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Text className="w-full cursor-pointer">Profile</Text></DropdownMenuItem>
                <DropdownMenuItem asChild><Text className="w-full cursor-pointer">Settings</Text></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <Text className="w-full text-destructive cursor-pointer">Logout</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileMenu
