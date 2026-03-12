import { postDataWithToken } from './api'
import { SALESFORCE_ENDPOINTS } from './api-endpoints'

export interface SalesforceSyncObjectResult {
    object?: string
    apiName?: string
    lastSystemModstamp?: string
    recordsFound?: number
    recordsProcessed?: number
    recordsArchived?: number
    recordsErrored?: number
    recordsExisting?: number
    recordsNew?: number
    durationSeconds?: number
    status?: string
    error?: string
}

export interface SalesforceSyncResponse {
    success: boolean
    message?: string
    preview?: boolean
    object?: string
    apiName?: string
    lastSystemModstamp?: string
    totalObjects?: number
    successfulObjects?: number
    partialObjects?: number
    failedObjects?: number
    totalRecordsProcessed?: number
    totalRecordsArchived?: number
    totalRecordsErrored?: number
    totalRecordsFound?: number
    totalRecordsExisting?: number
    totalRecordsNew?: number
    recordsProcessed?: number
    recordsArchived?: number
    recordsErrored?: number
    recordsFound?: number
    recordsExisting?: number
    recordsNew?: number
    durationSeconds?: number
    results?: SalesforceSyncObjectResult[]
    records?: Record<string, unknown>[]
}

export const salesforceApi = {
    previewAll: async () => {
        const response = await postDataWithToken<SalesforceSyncResponse>(
            SALESFORCE_ENDPOINTS.PREVIEW_ALL,
            {},
            { timeout: 0 }
        )
        return response.data
    },

    previewEntity: async (apiName: string) => {
        const response = await postDataWithToken<SalesforceSyncResponse>(
            SALESFORCE_ENDPOINTS.PREVIEW_ENTITY(apiName),
            {},
            { timeout: 0 }
        )
        return response.data
    },

    syncAll: async () => {
        const response = await postDataWithToken<SalesforceSyncResponse>(
            SALESFORCE_ENDPOINTS.SYNC_ALL,
            {},
            { timeout: 0 }
        )
        return response.data
    },

    syncEntity: async (apiName: string) => {
        const response = await postDataWithToken<SalesforceSyncResponse>(
            SALESFORCE_ENDPOINTS.SYNC_ENTITY(apiName),
            {},
            { timeout: 0 }
        )
        return response.data
    }
}
