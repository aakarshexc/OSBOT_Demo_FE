import { useLayout } from '@/context/layout-provider'
import { useLocation } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getSidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useDashboardStore } from '@/stores/dashboard-store'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const location = useLocation()
  const activeDashboardTab = useDashboardStore((state) => state.activeTab)
  const setDashboardTab = useDashboardStore((state) => state.setActiveTab)
  const sidebarData = getSidebarData({
    activeDashboardTab,
    setDashboardTab,
    currentPath: location.pathname,
  })
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content removed - NavUser moved to header */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
