// API endpoint constants
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Auth endpoints
export const AUTH_ENDPOINTS = {
    SIGNIN_OTP: '/users/sign-in-otp',
    SIGNUP: '/users/sign-up',
    RESEND_OTP: '/users/resend-otp',
    SIGNIN_EMAIL: '/users/sign-in-email',
    SIGNUP_OTP: '/users/sign-up-otp',
}

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
    STATS: '/dashboard/stats',
    ONBOARDING_PROGRESS: '/dashboard/onboarding-progress',
}

// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
    ACTIVE_CASES: '/analytics/active-cases',
    PIPELINE_VALUE: '/analytics/pipeline-value',
    SETTLEMENT_CASES: '/analytics/settlement-cases',
    LITIGATION_CASES: '/analytics/litigation-cases',
    PROSPECTS: '/analytics/prospects',
    SUMMARY: '/analytics/summary',
    HISTORY: '/analytics/history',
    DUMMY_RESPONSE: '/analytics/dummy-response',
    FILTER_OPTIONS: '/analytics/filter-options',
}

// Admin endpoints
export const ADMIN_ENDPOINTS = {
    CLIENTS: '/admin/clients',
    CLIENT_BY_ID: (clientId: string) => `/admin/clients/${clientId}`,
    USERS: '/admin/users',
    USER_BY_ID: (userId: string) => `/admin/users/${userId}`,
    ROLES: '/admin/roles',
    ROLE_PERMISSIONS: (roleId: string) => `/admin/roles/${roleId}/permissions`,
    PERMISSIONS: '/admin/permissions',
}

// Salesforce endpoints
export const SALESFORCE_ENDPOINTS = {
    SYNC_ALL: '/salesforce/sync/all',
    SYNC_ENTITY: (apiName: string) => `/salesforce/sync/${encodeURIComponent(apiName)}`,
    PREVIEW_ALL: '/salesforce/preview/all',
    PREVIEW_ENTITY: (apiName: string) => `/salesforce/preview/${encodeURIComponent(apiName)}`
}


// User endpoints
export const USER_ENDPOINTS = {
    ME: '/me',
    EDIT: '/users/edit',
    IMAGE: '/users/image',
}

// LiveKit endpoints
export const LIVEKIT_ENDPOINTS = {
    TOKEN: '/livekit/token',
}

export { BASE_URL }
