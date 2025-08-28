import DisplayWrapper from "@/components/core/wrapper/DisplayWrapper"
import Text from "@/components/ui/text";

interface ManageUsersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => Promise<void>

}

const ManageProfile = ({ open, onOpenChange, onRefresh }: ManageUsersProps) => {

  return (
    <DisplayWrapper
      mode="dialog"
      open={open}
      onOpenChange={onOpenChange}
      title={"Update User"}
      description={"Update User Profile"}
      size="lg"
    >
      <Text>Update User</Text>
    </DisplayWrapper>
  )
}

export default ManageProfile