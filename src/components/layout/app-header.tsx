import type { ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'

interface AppHeaderProps {
  topNavLinks?: Array<{
    title: string
    href: string
    isActive?: boolean
    disabled?: boolean
  }>
  rightContent?: ReactNode
  fixed?: boolean
}

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/clients': 'Clients',
  '/create-client': 'Create Client',
  '/create-role': 'Create Role',
  '/client/create-user': 'Create User',
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/dashboard')) return 'Dashboard'
  for (const [path, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(path)) return title
  }
  return 'Ellie Bot'
}

export function AppHeader({
  topNavLinks = [],
  rightContent,
  fixed = true,
}: AppHeaderProps) {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  const defaultContent = (
    <>
      <span className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">
        {pageTitle}
      </span>
      {rightContent && <div className="flex items-center">{rightContent}</div>}
    </>
  )

  return (
    <Header fixed={fixed}>
      {topNavLinks.length > 0 ? (
        <TopNav links={topNavLinks} />
      ) : (
        defaultContent
      )}
    </Header>
  )
}

