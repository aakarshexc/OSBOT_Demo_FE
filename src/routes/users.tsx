import { createFileRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/context/theme-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { CommandMenu } from '@/components/command-menu'
import { ProtectedRoute } from '@/components/protected-route'
import AllUsers from '@/features/admin/pages/AllUsers'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <LayoutProvider>
          <SearchProvider>
            <AuthenticatedLayout>
              <AllUsers />
            </AuthenticatedLayout>
            <CommandMenu />
          </SearchProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
