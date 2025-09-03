import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import MyForm, { type FormFieldItem } from "@/components/ui/my-form"
import useLoaderStore from "@/store/useLoaderStore";
import { schema, type Project, type ProjectUpdate } from "@config-vault/shared"
import { usePrivatePutApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { endpoints } from "@/lib/endpoints";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useProjectsStore from "@/store/useProjectsStore";

interface ManageProjectProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Project;
}

const ManageProject = ({ open, onOpenChange, data }: ManageProjectProps) => {
    const { startLoading, stopLoading } = useLoaderStore();
    const { refreshProjects } = useProjectsStore();
    const projectApi = usePrivatePutApi<Project>();
    const formItemData: FormFieldItem<ProjectUpdate>[] = [
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
            label: "Description",
            name: "description",
            layout: {
                row: 1,
                width: "full"
            },
            render: ({ field }) => <Textarea placeholder="Enter Description" {...field} value={field.value as string} />
        }
    ]

    const handleSubmit = async (values: ProjectUpdate) => {
        if (!data.id) return;

        await projectApi.putData(endpoints.projects.update(data.id), values as any, {
            actionCallbacks: {
                onSuccess: async () => {
                    await refreshProjects();
                    onOpenChange(false);
                    toast.success("Project updated successfully");
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
                    variant: "outline",
                    type: "submit",
                    icon: "Edit",
                }}
                onOpenChange={onOpenChange}
                title={"Update Project"}
                description={"Update Project Details"}
                size="sm"
            >
                <MyForm
                    key={data.id}
                    formSchema={schema.create.projectFrontend}
                    defaultValues={{
                        name: data.name || "",
                        description: data.description || ""
                    }}
                    formItemData={formItemData}
                    onSubmit={handleSubmit}
                    buttonActions={<Button type="submit" className="ml-auto block">Update</Button>}
                />
            </DisplayWrapper>
    )
}

export default ManageProject;
