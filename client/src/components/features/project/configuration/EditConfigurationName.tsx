import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import TextEditor from "@/components/editor/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MyForm, { type FormFieldItem } from "@/components/ui/my-form";
import { usePrivatePutApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import useLoaderStore from "@/store/useLoaderStore";
import { schema, type Configuration, type ConfigurationUpdate } from "@config-vault/shared";
import { toast } from "sonner";

interface ManageUsersProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRefresh?: () => Promise<void>
    data: Configuration;
}

const EditConfigurationName = ({ open, onOpenChange, onRefresh, data }: ManageUsersProps) => {
    const { startLoading, stopLoading } = useLoaderStore();
    const userUpdateApi = usePrivatePutApi<Configuration>();
    const formItemData: FormFieldItem<ConfigurationUpdate>[] = [
        {
            label: "Name",
            name: "name",
            layout: {
                row: 0,
                width: "full"
            },
            render: ({ field }) => <Input placeholder="Enter Name" {...field} value={field.value as string} />
        },
        {
            label: "Content",
            name: "content",
            layout: {
                row: 1,
                width: "full"
            },
            render: ({ field }) => <TextEditor content={field.value as string} onChange={field.onChange} />
        },
    ]

    const handleSubmit = async (values: ConfigurationUpdate) => {
        await userUpdateApi.putData<ConfigurationUpdate>(endpoints.configurations.update(data.id!), values, {
            actionCallbacks: {
                onSuccess: async () => {
                    await onRefresh?.();
                    onOpenChange(false);
                    toast.success("Configuration updated successfully");
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
            trigger={{
                variant: "ghost",
                type: "submit",
                icon: "Edit",
            }}
            onOpenChange={onOpenChange}
            title={"Update Configuration"}
            size="md"
        >
            <MyForm
                formSchema={schema.update.configuration}
                defaultValues={{
                    name: data.name || "",
                    content: data.content || "",
                }}
                formItemData={formItemData}
                onSubmit={handleSubmit}
                buttonActions={<Button type="submit" className="ml-auto block">Update</Button>}
            />
        </DisplayWrapper>
    )
}

export default EditConfigurationName