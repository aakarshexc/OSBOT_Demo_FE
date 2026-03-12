import { useAuthStore } from '@/stores/auth-store'

export function isAuthenticated(): boolean {
  const { isAuthenticated } = useAuthStore.getState()
  return isAuthenticated
}
