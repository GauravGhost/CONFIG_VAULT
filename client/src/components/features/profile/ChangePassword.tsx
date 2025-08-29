import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormFieldItem } from "@/components/ui/my-form";
import MyForm from "@/components/ui/my-form";
import { usePrivatePostApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import useLoaderStore from "@/store/useLoaderStore";
import { schema, type ChangePassword as ChangePasswordType, type User } from "@config-vault/shared";
import { toast } from "sonner";

interface ManageUsersProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRefresh?: () => Promise<void>
    data: User;
}

const ChangePassword = ({ open, onOpenChange, data }: ManageUsersProps) => {
    const changePasswordApi = usePrivatePostApi<User>();
    const { startLoading, stopLoading } = useLoaderStore();
    const formItemData: FormFieldItem<ChangePasswordType>[] = [
        {
            label: "Old Password",
            name: "old_password",
            layout: {
                row: 0,
                width: "full"
            },
            render: ({ field }) => <Input placeholder="Enter Old Password" {...field} value={field.value as string} />
        },
        {
            label: "New Password",
            name: "new_password",
            layout: {
                row: 0,
                width: "full"
            },
            render: ({ field }) => <Input placeholder="Enter New Password" {...field} value={field.value as string} />
        }
    ]

    const handleSubmit = async (values: ChangePasswordType) => {
        await changePasswordApi.postData<ChangePasswordType>(endpoints.users.changePassword, values, {
            actionCallbacks: {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success("Password changed successfully");
                },
                onError: (error) => toast.error(error ?? "Something went wrong"),
                onLoadingStart: () => startLoading(),
                onLoadingStop: () => stopLoading(),
            }
        });
    };
    return (
        <DisplayWrapper
            mode="dialog"
            open={open}
            trigger={<Button variant="link" className="cursor-pointer text-blue-500">Change Password</Button>}
            onOpenChange={onOpenChange}
            title={"Change Password"}
            size="sm"
        >
            <MyForm
                formSchema={schema.update.password}
                defaultValues={{
                    old_password: "",
                    new_password: "",
                }}
                formItemData={formItemData}
                onSubmit={handleSubmit}
                buttonActions={<Button type="submit" className="ml-auto block">Update</Button>}
            />
        </DisplayWrapper>
    )
}

export default ChangePassword