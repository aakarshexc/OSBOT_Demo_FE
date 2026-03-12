import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    adminApi,
    type ClientListItem,
    type CreateClientPayload,
    type CreateClientResult,
    type UserListItem,
    type CreateUserPayload,
    type UpdateUserRequest,
    type RoleListItem,
    type PermissionListItem,
    type CreateOrUpdateRolePayload,
    type CreateOrUpdateRoleResponse,
} from '@/lib/admin-api'

// Clients
export const useAdminClients = () => {
    return useQuery<ClientListItem[]>({
        queryKey: ['admin-clients'],
        queryFn: () => adminApi.getClients(),
    })
}

export const useCreateClient = () => {
    const queryClient = useQueryClient()
    return useMutation<CreateClientResult, Error, CreateClientPayload>({
        mutationFn: (payload) => adminApi.createClient(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
        },
    })
}

// Users
export const useAdminUsers = () => {
    return useQuery<UserListItem[]>({
        queryKey: ['admin-users'],
        queryFn: () => adminApi.getUsers(),
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation<void, Error, CreateUserPayload>({
        mutationFn: (payload) => adminApi.createUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
        },
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation<void, Error, { userId: string; payload: UpdateUserRequest }>({
        mutationFn: ({ userId, payload }) => adminApi.updateUser(userId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
        },
    })
}

// Roles
export const useAdminRoles = (page = 1, limit = 50) => {
    return useQuery<RoleListItem[]>({
        queryKey: ['admin-roles', page, limit],
        queryFn: () => adminApi.getRoles(page, limit),
    })
}

export const useAdminPermissions = (page = 1, limit = 50) => {
    return useQuery<PermissionListItem[]>({
        queryKey: ['admin-permissions', page, limit],
        queryFn: () => adminApi.getPermissions(page, limit),
    })
}

export const useRolePermissions = (roleId: string, page = 1, limit = 50) => {
    return useQuery<PermissionListItem[]>({
        queryKey: ['role-permissions', roleId, page, limit],
        queryFn: () => adminApi.getRolePermissions(roleId, page, limit),
        enabled: !!roleId,
    })
}

export const useCreateOrUpdateRole = () => {
    const queryClient = useQueryClient()
    return useMutation<CreateOrUpdateRoleResponse, Error, CreateOrUpdateRolePayload>({
        mutationFn: (payload) => adminApi.createOrUpdateRole(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
        },
    })
}

