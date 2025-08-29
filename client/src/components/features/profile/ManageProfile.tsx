import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormFieldItem } from "@/components/ui/my-form";
import MyForm from "@/components/ui/my-form";
import { usePrivatePutApi } from "@/hooks/useApi";
import { endpoints } from "@/lib/endpoints";
import useLoaderStore from "@/store/useLoaderStore";
import { schema, type User, type UserUpdate } from "@config-vault/shared";
import { toast } from "sonner";

interface ManageUsersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => Promise<void>
  data: User;
}

const ManageProfile = ({ open, onOpenChange, onRefresh, data }: ManageUsersProps) => {
  const { startLoading, stopLoading } = useLoaderStore();
  const userUpdateApi = usePrivatePutApi<User>();
  const formItemData: FormFieldItem<UserUpdate>[] = [
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
      label: "Email",
      name: "email",
      layout: {
        row: 1,
        width: "full"
      },
      render: ({ field }) => <Input placeholder="Enter Email" {...field} value={field.value as string} />
    }
  ]

  const handleSubmit = async (values: UserUpdate) => {
    await userUpdateApi.putData<UserUpdate>(endpoints.users.update(data.id!), values, {
      actionCallbacks: {
        onSuccess: async () => {
          await onRefresh?.();
          onOpenChange(false);
          toast.success("User updated successfully");
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
      title={"Update User"}
      description={"Update User Profile"}
      size="sm"
    >
      <MyForm
        formSchema={schema.update.user}
        defaultValues={{
          name: data.name || "",
          email: data.email || "",
        }}
        formItemData={formItemData}
        onSubmit={handleSubmit}
        buttonActions={<Button type="submit" className="ml-auto block">Update</Button>}
      />
    </DisplayWrapper>
  )
}

export default ManageProfile