// Re-export types from admin-api for backward compatibility
export type {
  ClientListItem,
  CreateClientPayload,
  CreateClientResult,
  RoleName,
  UserListItem,
  UpdateUserRequest,
  CreateUserPayload,
  RoleListItem,
  PermissionListItem,
  CreateOrUpdateRolePayload,
  CreateOrUpdateRoleResponse,
} from '@/lib/admin-api'

// Component-specific types
export interface EditUserModalProps {
  user: import('@/lib/admin-api').UserListItem;
  availableRoles?: import('@/lib/admin-api').RoleListItem[] | import('@/lib/admin-api').RoleName[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: import('@/lib/admin-api').UpdateUserRequest) => void;
}

