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

  const branding = (
    <span className="font-heading font-extrabold tracking-tight text-foreground text-2xl sm:text-3xl leading-none">
      Ellie Bot
    </span>
  )

  const defaultContent = (
    <>
      {branding}
      <span className="text-muted-foreground/40 text-xl leading-none select-none">
        /
      </span>
      <span className="flex-1 min-w-0 text-sm font-medium text-muted-foreground truncate">
        {pageTitle}
      </span>
      {rightContent && <div className="flex items-center">{rightContent}</div>}
    </>
  )

  const navContent = (
    <>
      {branding}
      <span className="text-muted-foreground/40 text-xl leading-none select-none">
        /
      </span>
      <TopNav links={topNavLinks} />
    </>
  )

  return (
    <Header fixed={fixed}>
      {topNavLinks.length > 0 ? navContent : defaultContent}
    </Header>
  )
}

