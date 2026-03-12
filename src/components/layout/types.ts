type User = {
  name: string
  email: string
  avatar: string
}


type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  isActive?: boolean
  onClick?: () => void
}

type NavLink = BaseNavItem & {
  url: string
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  defaultOpen?: boolean
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
