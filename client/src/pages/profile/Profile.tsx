import SectionWrapper from "@/components/core/wrapper/SectionWrapper"
import { pageConfig } from "@/constant/page-config"

const Profile = () => {
  return (
    <div>Profile</div>
  )
}

export default SectionWrapper("profile", Profile, pageConfig.profile.breadcrumb)