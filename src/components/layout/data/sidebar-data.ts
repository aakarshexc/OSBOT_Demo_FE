import {
  LayoutDashboard,
  Users,
  Building2,
  UserPlus,
  Shield,
} from 'lucide-react'
import { type NavCollapsible, type SidebarData } from '../types'
import { useAuthStore } from '@/stores/auth-store'
import { type DashboardTab } from '@/stores/dashboard-store'

// This will be a function that returns sidebar data based on permissions
type SidebarOptions = {
  activeDashboardTab?: DashboardTab
  setDashboardTab?: (tab: DashboardTab) => void
  currentPath?: string
}

export function getSidebarData(options: SidebarOptions = {}): SidebarData {
  // We can't use hooks here, so we'll get the state directly
  const state = useAuthStore.getState()
  const user = state.user
  const permissions = state.permissions || []

  const hasUserView = permissions.includes('user:view')
  const hasClientView = permissions.includes('client:view')
  const hasClientCreate = permissions.includes('client:create')
  const hasUserCreate = permissions.includes('user:create')
  const hasRoleCreate = permissions.includes('role:create')
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const isClientAdmin = user?.role === 'CLIENT_ADMIN'

  const navItems: SidebarData['navGroups'] = []

  // Dashboard - show for ALL roles
  const activeDashboardTab = options.activeDashboardTab ?? 'overview'
  const setDashboardTab = options.setDashboardTab
  const isDashboardRoute = (options.currentPath || '').startsWith('/dashboard')
  const dashboardTabItems: NavCollapsible['items'] = [
    {
      title: 'Overview',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'overview',
      onClick: setDashboardTab ? () => setDashboardTab('overview') : undefined,
    },
    {
      title: 'Active Cases',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'active-cases',
      onClick: setDashboardTab ? () => setDashboardTab('active-cases') : undefined,
    },
    {
      title: 'Reports',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'reports',
      onClick: setDashboardTab ? () => setDashboardTab('reports') : undefined,
    },
    {
      title: 'Settlement Cases',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'settlement',
      onClick: setDashboardTab ? () => setDashboardTab('settlement') : undefined,
    },
    {
      title: 'Litigation Cases',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'litigation',
      onClick: setDashboardTab ? () => setDashboardTab('litigation') : undefined,
    },
    {
      title: 'Prospects',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'prospects',
      onClick: setDashboardTab ? () => setDashboardTab('prospects') : undefined,
    },
    {
      title: 'History',
      url: '/dashboard',
      isActive: isDashboardRoute && activeDashboardTab === 'history',
      onClick: setDashboardTab ? () => setDashboardTab('history') : undefined,
    },
  ]
  const generalItems: SidebarData['navGroups'][0]['items'] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      defaultOpen: true,
      items: dashboardTabItems,
    },
  ]

  // Admin section items
  const adminItems: SidebarData['navGroups'][0]['items'] = []

  // Users
  if (hasUserView) {
    adminItems.push({
      title: 'Users',
      url: '/users',
      icon: Users,
    })
  }

  // Clients
  if (hasClientView) {
    adminItems.push({
      title: 'Clients',
      url: '/clients',
      icon: Building2,
    })
  }

  // Create Client
  if (hasClientCreate) {
    adminItems.push({
      title: 'Create Client',
      url: '/create-client',
      icon: Building2,
    })
  }

  // Create User
  if (hasUserCreate) {
    adminItems.push({
      title: 'Create User',
      url: '/client/create-user',
      icon: UserPlus,
    })
  }

  // Create Role
  if (isSuperAdmin || isClientAdmin || hasRoleCreate) {
    adminItems.push({
      title: 'Create Role',
      url: '/create-role',
      icon: Shield,
    })
  }

  // Always add General section with Dashboard
  navItems.push({
    title: 'General',
    items: generalItems,
  })

  // Add Admin section if there are any admin items
  if (adminItems.length > 0) {
    navItems.push({
      title: 'Admin',
      items: adminItems,
    })
  }

  return {
    user: {
      name: user?.name || 'User',
      email: user?.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navGroups: navItems,
  }
}

// Default export for backward compatibility
export const sidebarData: SidebarData = {
  user: {
    name: 'SettleAssist',
    email: 'demo@settleassist.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          icon: LayoutDashboard,
          defaultOpen: true,
          items: [
            {
              title: 'Overview',
              url: '/dashboard',
            },
            {
              title: 'Active Cases',
              url: '/dashboard',
            },
            {
              title: 'Reports',
              url: '/dashboard',
            },
            {
              title: 'Settlement Cases',
              url: '/dashboard',
            },
            {
              title: 'Litigation Cases',
              url: '/dashboard',
            },
            {
              title: 'Prospects',
              url: '/dashboard',
            },
            {
              title: 'History',
              url: '/dashboard',
            },
          ],
        },
      ],
    },
  ],
}
