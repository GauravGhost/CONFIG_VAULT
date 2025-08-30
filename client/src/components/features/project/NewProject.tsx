import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import MyForm, { type FormFieldItem } from "@/components/ui/my-form"
import useLoaderStore from "@/store/useLoaderStore";
import { schema, type Project, type ProjectCreateFrontend } from "@config-vault/shared"
import { usePrivatePostApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { endpoints } from "@/lib/endpoints";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/components/core/wrapper/SectionWrapper";
import { newProjectConfig } from "@/constant/page-config/project-config";
import { useNavigate } from "react-router";

const NewProject = () => {
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoaderStore();
    const projectApi = usePrivatePostApi<Project>();
    const formItemData: FormFieldItem<ProjectCreateFrontend>[] = [
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

    const handleSubmit = async (values: ProjectCreateFrontend) => {
        await projectApi.postData(endpoints.projects.create, values as any, {
            actionCallbacks: {
                onSuccess: async (data) => {
                    toast.success("Project created successfully");
                    navigate(`/projects/${data.id}`);
                },
                onError: (error) => toast.error(error ?? "Something went wrong"),
                onLoadingStart: () => startLoading(),
                onLoadingStop: () => stopLoading(),
            }
        });
    };
    return (
        <div className="flex justify-center pt-10">
            <DisplayWrapper
                mode="card"
                title={"New Project"}
                description={"Create a new project"}
                size="md"
                className="w-full"
            >
                <MyForm
                    formSchema={schema.create.projectFrontend}
                    defaultValues={{
                        name: "",
                        description: ""
                    }}
                    formItemData={formItemData}
                    onSubmit={handleSubmit}
                    buttonActions={<Button type="submit" className="ml-auto block">Create</Button>}
                />
            </DisplayWrapper>
        </div>
    )
}

export default SectionWrapper(newProjectConfig.name, NewProject, newProjectConfig.breadcrumb);
