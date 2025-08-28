import SectionWrapper from "@/components/core/wrapper/SectionWrapper"
import PreviewProfile from "@/components/features/profile/PreviewProfile"
import { pageConfig } from "@/constant/page-config"

const Profile = () => {
  return (
    <PreviewProfile />
  )
}

export default SectionWrapper("profile", Profile, pageConfig.profile.breadcrumb)