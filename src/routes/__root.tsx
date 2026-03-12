import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import SkinnerBot from '@/components/skinner-bot'
import { useAuthStore } from '@/stores/auth-store'

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  const isLoginPage = location.pathname === '/sign-in' || location.pathname === '/login'

  return (
    <>
      <Outlet />
      <Toaster duration={5000} />
      {isAuthenticated && !isLoading && !isLoginPage && (
        <SkinnerBot />
      )}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})

