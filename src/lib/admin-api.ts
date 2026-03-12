import { getDataWithToken, postDataWithToken, patchDataWithToken } from './api'
import { ADMIN_ENDPOINTS } from './api-endpoints'
import type { AxiosRequestConfig } from 'axios'

// Types
export interface ClientListItem {
    clientId: string
    clientName: string
    clientDescription: string | null
    createdAt: string
}

export interface ClientsApiResponse {
    success: boolean
    data: ClientListItem[]
}

export interface CreateClientPayload {
    clientName: string
    clientDescription?: string
    adminEmail: string
    adminName: string
    adminPassword: string
}

export interface SalesforceVariables {
    SALESFORCE_AUTH_URL: string
    SALESFORCE_INSTANCE_URL: string
    SALESFORCE_CLIENT_ID: string
    SALESFORCE_CLIENT_SECRET: string
    SALESFORCE_API_VERSION: string
}

export interface UpdateClientPayload {
    salesforceVariables: SalesforceVariables
}

export interface CreateClientResult {
    success: boolean
    data?: unknown
}

export type RoleName = 'SUPER_ADMIN' | 'CLIENT_ADMIN' | 'STAFF' | 'OBSERVER'

export interface UserListItem {
    userId: string
    email: string
    name: string
    role: string
    roleDescription: string | null
    clientId: string | null
    clientName: string | null
    createdAt: string
}

export interface UsersApiResponse {
    success: boolean
    data: UserListItem[]
}

export interface UpdateUserRequest {
    name?: string
    email?: string
    roleName?: RoleName
    password?: string
}

export interface CreateUserPayload {
    email: string
    name: string
    password: string
    roleName: RoleName
    clientId?: string | null
}

export interface RoleListItem {
    roleId: string
    roleName: string
    roleDescription: string
    isGlobal: boolean
    clientId: string | null
    clientName: string | null
}

export interface RolesApiResponse {
    success: boolean
    data: {
        roles: RoleListItem[]
        total: number
        page: number
        limit: number
    }
}

export interface PermissionListItem {
    permissionId: string
    permissionName: string
    permissionDescription: string
}

export interface PermissionsApiResponse {
    success: boolean
    data: {
        permissions: PermissionListItem[]
        total: number
        page: number
        limit: number
    }
}

export interface CreateOrUpdateRolePayload {
    roleId?: string
    roleName: string
    roleDescription: string
    permissionIds: string[]
}

export interface CreateOrUpdateRoleResponse {
    success: boolean
    data: {
        roleId: string
        roleName: string
        roleDescription: string
        isGlobal: boolean
        clientId: string | null
        permissions: PermissionListItem[]
    }
}

// API Functions
export const adminApi = {
    getClients: async () => {
        const response = await getDataWithToken<ClientsApiResponse>(
            ADMIN_ENDPOINTS.CLIENTS
        )
        if (!response.data.success) {
            throw new Error('Failed to load clients.')
        }
        return Array.isArray(response.data.data) ? response.data.data : []
    },

    createClient: async (payload: CreateClientPayload) => {
        const response = await postDataWithToken<CreateClientResult>(
            ADMIN_ENDPOINTS.CLIENTS,
            payload
        )
        return { success: true, data: response.data }
    },

    updateClient: async (clientId: string, payload: UpdateClientPayload) => {
        await postDataWithToken(
            ADMIN_ENDPOINTS.CLIENT_BY_ID(clientId),
            payload
        )
    },

    getUsers: async () => {
        const response = await getDataWithToken<UsersApiResponse>(
            ADMIN_ENDPOINTS.USERS
        )
        if (!response.data.success) {
            throw new Error('Failed to load users.')
        }
        return response.data.data ?? []
    },

    createUser: async (payload: CreateUserPayload) => {
        await postDataWithToken(ADMIN_ENDPOINTS.USERS, payload)
    },

    updateUser: async (userId: string, payload: UpdateUserRequest) => {
        await patchDataWithToken(
            ADMIN_ENDPOINTS.USER_BY_ID(userId),
            payload
        )
    },

    getRoles: async (page = 1, limit = 50) => {
        const config: AxiosRequestConfig = {
            params: { page, limit },
        }
        const response = await getDataWithToken<RolesApiResponse>(
            ADMIN_ENDPOINTS.ROLES,
            config
        )
        if (!response.data.success) {
            throw new Error('Failed to load roles.')
        }
        return response.data.data?.roles ?? []
    },

    getPermissions: async (page = 1, limit = 50) => {
        const config: AxiosRequestConfig = {
            params: { page, limit },
        }
        const response = await getDataWithToken<PermissionsApiResponse>(
            ADMIN_ENDPOINTS.PERMISSIONS,
            config
        )
        if (!response.data.success) {
            throw new Error('Failed to load permissions.')
        }
        return response.data.data?.permissions ?? []
    },

    getRolePermissions: async (roleId: string, page = 1, limit = 50) => {
        const config: AxiosRequestConfig = {
            params: { page, limit },
        }
        const response = await getDataWithToken<PermissionsApiResponse>(
            ADMIN_ENDPOINTS.ROLE_PERMISSIONS(roleId),
            config
        )
        if (!response.data.success) {
            throw new Error('Failed to load role permissions.')
        }
        return response.data.data?.permissions ?? []
    },

    createOrUpdateRole: async (payload: CreateOrUpdateRolePayload) => {
        const response = await postDataWithToken<CreateOrUpdateRoleResponse>(
            ADMIN_ENDPOINTS.ROLES,
            payload
        )
        if (!response.data.success) {
            throw new Error('Failed to create or update role.')
        }
        return response.data
    },
}

