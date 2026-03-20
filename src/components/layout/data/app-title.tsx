import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppTitle() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-primary/10 hover:text-primary active:bg-primary/20'
          asChild
        >
          <Link to='/dashboard'>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-bold text-2xl'>Ellie Bot</span>
              <span className='truncate text-xs font-medium text-muted-foreground mt-0.5'>PI Dashboard</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

