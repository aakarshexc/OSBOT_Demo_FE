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
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

