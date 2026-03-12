import { useAuthStore } from '@/stores/auth-store'

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: string): boolean {
  const user = useAuthStore((state) => state.user)
  return user?.role === role
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(roles: string[]): boolean {
  const user = useAuthStore((state) => state.user)
  return user ? roles.includes(user.role) : false
}

/**
 * Hook to get current user's role
 */
export function useUserRole(): string | undefined {
  const user = useAuthStore((state) => state.user)
  return user?.role
}

/**
 * Hook to get current user
 */
export function useUser() {
  return useAuthStore((state) => state.user)
}
