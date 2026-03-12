import { useAuthStore } from '@/stores/auth-store'

/**
 * Check if user has a specific permission
 */
export function hasPermission(permission: string): boolean {
  const { permissions } = useAuthStore.getState()
  return permissions.includes(permission)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(requiredPermissions: string[]): boolean {
  const { permissions } = useAuthStore.getState()
  return requiredPermissions.some((perm) => permissions.includes(perm))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(requiredPermissions: string[]): boolean {
  const { permissions } = useAuthStore.getState()
  return requiredPermissions.every((perm) => permissions.includes(perm))
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
  const { user } = useAuthStore.getState()
  return user?.role === role
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const { user } = useAuthStore.getState()
  return user ? roles.includes(user.role) : false
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(): boolean {
  const { isAuthenticated } = useAuthStore.getState()
  return isAuthenticated
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return useAuthStore.getState().user
}

/**
 * Get current user's permissions
 */
export function getCurrentPermissions(): string[] {
  return useAuthStore.getState().permissions
}
