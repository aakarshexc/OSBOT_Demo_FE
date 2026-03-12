import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect all authenticated users to dashboard
      navigate({ to: '/dashboard' })
    } else if (!isLoading && !isAuthenticated) {
      navigate({ to: '/sign-in' })
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto' />
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    </div>
  )
}

