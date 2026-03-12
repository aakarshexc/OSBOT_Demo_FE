import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { SignIn } from '@/features/auth/sign-in'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()
  const { isAuthenticated, checkAuth, user } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect all authenticated users to dashboard
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, user, navigate])

  if (isAuthenticated) {
    return null
  }

  return <SignIn />
}

