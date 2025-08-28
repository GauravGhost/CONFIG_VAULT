import { Loader } from "@/components/ui/loader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { usePrivateGetApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import { formatDate } from "@/lib/datetime";
import type { User } from "@config-vault/shared";
import { getInitialWords } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { colorTheme } from "@/constant/enums";
import ManageProfile from "./ManageProfile";
import { useState } from "react";

const PreviewProfile = () => {
    const { data: userData, loading } = usePrivateGetApi<User>(endpoints.users.getCurrent);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
        <div className="max-w-4xl mx-auto p-6">
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-16">
                        {/* Left side - Avatar and Name */}
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-24 h-24 ring-4 ring-background shadow-lg">
                                <AvatarImage
                                    src={userData?.avatar_url || ''}
                                    alt={userData?.name || 'Profile'}
                                />
                                <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                                    {userData?.name ? getInitialWords(userData.name ?? userData.username) : 'UN'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-3 flex flex-col items-center">
                                <h1 className="text-2xl font-bold text-foreground">
                                    {userData?.name ?? userData?.username ?? 'Unknown User'}
                                </h1>
                                <div className="flex gap-2">
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
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="AtSign" className="w-4 h-4" />
                                        Username
                                    </div>
                                    <p className="font-mono text-base">{userData?.username || 'N/A'}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="Mail" className="w-4 h-4" />
                                        Email
                                    </div>
                                    <p className="text-base">{userData?.email || 'Not provided'}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="Lock" className="w-4 h-4" />
                                        Password
                                    </div>
                                    <Button variant="link" className="cursor-pointer text-blue-500">Change Password</Button>
                                </div>


                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="UserPlus" className="w-4 h-4" />
                                        Member Since
                                    </div>
                                    <p className="text-base">
                                        {userData?.created_at ? formatDate(userData.created_at, 'compact') : 'N/A'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Icon name="RefreshCw" className="w-4 h-4" />
                                        Last Updated
                                    </div>
                                    <p className="text-base">
                                        {userData?.updated_at ? formatDate(userData.updated_at, 'relative') : 'N/A'}
                                    </p>
                                </div>
                            <ManageProfile
                                open={isPreviewOpen}
                                onOpenChange={setIsPreviewOpen}
                            />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PreviewProfile