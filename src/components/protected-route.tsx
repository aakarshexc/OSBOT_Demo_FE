import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { SignIn } from '@/features/auth/sign-in'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto' />
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SignIn />
  }

  return <>{children}</>
}

