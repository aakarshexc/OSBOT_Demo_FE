import { useAuthStore } from '@/stores/auth-store'

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(permission: string): boolean {
  const permissions = useAuthStore((state) => state.permissions)
  return permissions.includes(permission)
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useHasAnyPermission(requiredPermissions: string[]): boolean {
  const permissions = useAuthStore((state) => state.permissions)
  return requiredPermissions.some((perm) => permissions.includes(perm))
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useHasAllPermissions(requiredPermissions: string[]): boolean {
  const permissions = useAuthStore((state) => state.permissions)
  return requiredPermissions.every((perm) => permissions.includes(perm))
}

/**
 * Hook to get all user permissions
 */
export function usePermissions(): string[] {
  return useAuthStore((state) => state.permissions)
}
