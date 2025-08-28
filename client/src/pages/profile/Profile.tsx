import SectionWrapper from "@/components/core/wrapper/SectionWrapper"
import ProfilePreview from "@/components/features/profile/ProfilePreview"
import { pageConfig } from "@/constant/page-config"

const Profile = () => {
  return (
    <ProfilePreview />
  )
}

export default SectionWrapper("profile", Profile, pageConfig.profile.breadcrumb)