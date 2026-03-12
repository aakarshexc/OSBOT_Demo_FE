import { createFileRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/context/theme-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { CommandMenu } from '@/components/command-menu'
import { ProtectedRoute } from '@/components/protected-route'
import ClientSetupPage from '@/features/admin/pages/ClientSetupPage'

export const Route = createFileRoute('/create-client')({
  component: CreateClientPage,
})

function CreateClientPage() {
  return (
    <ProtectedRoute>
      <ThemeProvider>
        <LayoutProvider>
          <SearchProvider>
            <AuthenticatedLayout>
              <ClientSetupPage />
            </AuthenticatedLayout>
            <CommandMenu />
          </SearchProvider>
        </LayoutProvider>
      </ThemeProvider>
    </ProtectedRoute>
  )
}

