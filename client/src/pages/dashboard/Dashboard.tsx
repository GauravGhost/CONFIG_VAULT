import SectionWrapper from "@/components/core/wrapper/SectionWrapper"
import { dashboardConfig } from "@/constant/page-config/dashboard-config"

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default SectionWrapper("dashboard", Dashboard, dashboardConfig.breadcrumb)