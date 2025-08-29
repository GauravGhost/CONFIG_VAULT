import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { usePrivateGetApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import { formatDate } from "@/lib/datetime";
import type { User } from "@config-vault/shared";
import { getInitialWords } from "@/lib/utils";
import { colorTheme } from "@/constant/enums";
import ManageProfile from "./ManageProfile";
import { useState } from "react";
import ChangePassword from "./ChangePassword";

const PreviewProfile = () => {
    const { data: userData, loading, fetch } = usePrivateGetApi<User>(endpoints.users.getCurrent);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleRefresh = async () => {
        await fetch(endpoints.users.getCurrent);
    };

    if (loading && !userData) {
        return <Loader isLoading={loading} />
    }

    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return colorTheme.red.mix;
            case 'manager':
                return colorTheme.blue.mix;
            case 'user':
                return colorTheme.green.mix;
            default:
                return colorTheme.gray.mix;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
                        {/* Left side - Avatar and Name */}
                        <div className="flex flex-col items-center space-y-4 lg:flex-shrink-0">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-background shadow-lg">
                                <AvatarImage
                                    src={userData?.avatar_url || ''}
                                    alt={userData?.name || 'Profile'}
                                />
                                <AvatarFallback className="text-xl sm:text-2xl font-semibold bg-primary text-primary-foreground">
                                    {userData?.name ? getInitialWords(userData.name ?? userData.username) : 'UN'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-3 flex flex-col items-center text-center lg:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                                    {userData?.name ?? userData?.username ?? 'Unknown User'}
                                </h1>
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                    <Badge
                                        variant="outline"
                                        className={getRoleColor(userData?.role || '')}
                                    >
                                        <Icon name="Shield" className="w-3 h-3" />
                                        {userData?.role || 'user'}
                                    </Badge>
                                    {userData?.is_active && (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                            <Icon name="CheckCircle" className="w-3 h-3" />
                                            Active
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side - Information Grid */}
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="AtSign" className="w-4 h-4" />
                                        Username
                                    </div>
                                    <p className="font-mono text-sm sm:text-base break-all">{userData?.username || 'N/A'}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="Mail" className="w-4 h-4" />
                                        Email
                                    </div>
                                    <p className="text-sm sm:text-base break-all">{userData?.email || 'Not provided'}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="Lock" className="w-4 h-4" />
                                        Password
                                    </div>
                                    {userData && <ChangePassword open={isChangingPassword} onOpenChange={setIsChangingPassword} data={userData} />}
                                </div>


                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="UserPlus" className="w-4 h-4" />
                                        Member Since
                                    </div>
                                    <p className="text-sm sm:text-base">
                                        {userData?.created_at ? formatDate(userData.created_at, 'compact') : 'N/A'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="RefreshCw" className="w-4 h-4" />
                                        Last Updated
                                    </div>
                                    <p className="text-sm sm:text-base">
                                        {userData?.updated_at ? formatDate(userData.updated_at, 'relative') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center sm:justify-end pt-0 px-4 sm:px-6">
                    {userData && (
                        <ManageProfile
                            open={isEditing}
                            onOpenChange={setIsEditing}
                            data={userData}
                            onRefresh={handleRefresh}
                        />
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default PreviewProfile