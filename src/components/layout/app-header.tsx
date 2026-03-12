import type { ReactNode } from 'react'
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

export function AppHeader({
  topNavLinks = [],
  rightContent,
  fixed = true,
}: AppHeaderProps) {
  const defaultRightContent = (
    <div className='ms-auto flex items-center space-x-4'>
      {/* Theme toggle removed - always using light theme */}
    </div>
  )

  return (
    <Header fixed={fixed}>
      {topNavLinks.length > 0 && <TopNav links={topNavLinks} />}
      {rightContent || defaultRightContent}
    </Header>
  )
}

