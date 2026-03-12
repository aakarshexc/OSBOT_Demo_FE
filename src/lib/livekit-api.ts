import { postDataWithToken } from './api'
import { LIVEKIT_ENDPOINTS } from './api-endpoints'

export interface LiveKitTokenResponse {
    success: boolean
    data: {
        token: string
        roomName?: string
        serverUrl?: string
    }
    error?: string
}

export interface LiveKitTokenRequest {
    participantName: string
    agentId: string
    agentName?: string
    roomName?: string
}

const getTokenRequest = (body: LiveKitTokenRequest) => {
    // Do not enforce a frontend timeout for LiveKit token fetches.
    return postDataWithToken<LiveKitTokenResponse>(LIVEKIT_ENDPOINTS.TOKEN, body, { timeout: 0 })
}

/**
 * Fetch a LiveKit access token from the backend.
 * Sends participantName (random ID) and agentId for agent dispatch.
 */
export const fetchLiveKitToken = async (
    params: LiveKitTokenRequest
): Promise<{ token: string; roomName?: string; serverUrl?: string }> => {
    const response = await getTokenRequest(params)

    if (!response.data.success || !response.data.data?.token) {
        throw new Error(response.data?.error ?? 'Failed to fetch LiveKit token')
    }

    return {
        token: response.data.data.token,
        roomName: response.data.data.roomName,
        serverUrl: response.data.data.serverUrl,
    }
}

export const livekitApi = {
    getToken: fetchLiveKitToken
}