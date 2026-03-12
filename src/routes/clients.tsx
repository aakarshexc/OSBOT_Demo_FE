import { createFileRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/context/theme-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { CommandMenu } from '@/components/command-menu'
import { ProtectedRoute } from '@/components/protected-route'
import AdminDirectoryPage from '@/features/admin/pages/Clientpage'

export const Route = createFileRoute('/clients')({
  component: ClientsPage,
})

function ClientsPage() {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <LayoutProvider>
          <SearchProvider>
            <AuthenticatedLayout>
              <AdminDirectoryPage />
            </AuthenticatedLayout>
            <CommandMenu />
          </SearchProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
