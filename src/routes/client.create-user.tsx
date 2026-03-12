import { createFileRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/context/theme-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { CommandMenu } from '@/components/command-menu'
import { ProtectedRoute } from '@/components/protected-route'
import CreateUser from '@/features/admin/components/CreateUser'

export const Route = createFileRoute('/client/create-user')({
  component: CreateUserPage,
})

function CreateUserPage() {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <LayoutProvider>
          <SearchProvider>
            <AuthenticatedLayout>
              <CreateUser />
            </AuthenticatedLayout>
            <CommandMenu />
          </SearchProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
