import { createFileRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/context/theme-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { CommandMenu } from '@/components/command-menu'
import { ProtectedRoute } from '@/components/protected-route'
import CreateRolePage from '@/features/admin/pages/CreateRolePage'

export const Route = createFileRoute('/create-role')({
  component: CreateRolePageComponent,
})

function CreateRolePageComponent() {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <LayoutProvider>
          <SearchProvider>
            <AuthenticatedLayout>
              <CreateRolePage />
            </AuthenticatedLayout>
            <CommandMenu />
          </SearchProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ProtectedRoute>
  )
}

