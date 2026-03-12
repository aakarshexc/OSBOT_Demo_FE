import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management helpers
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

// Handle unauthorized access
const handleUnauthorized = () => {
  removeToken()
  if (typeof window !== 'undefined') {
    // Redirect to sign-in page
    window.location.href = '/sign-in'
  }
}

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  }
)

// Helper functions for API calls
export const getDataWithToken = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => {
  return api.get<T>(url, config)
}

export const postDataWithToken = <T = unknown>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
) => {
  return api.post<T>(url, data, config)
}

export const putDataWithToken = <T = unknown>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
) => {
  return api.put<T>(url, data, config)
}

export const patchDataWithToken = <T = unknown>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
) => {
  return api.patch<T>(url, data, config)
}

export const deleteDataWithToken = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => {
  return api.delete<T>(url, config)
}

// Query params helper
export interface IQueryParams {
  [key: string]: string | number | boolean | undefined | null
}

export const createQueryString = (params: IQueryParams): string => {
  const { limit = 10, page = 1, searchTerm = '', ...otherParams } = params
  let queryString = `?limit=${limit}&page=${page}`

  if (searchTerm) {
    queryString += `&searchTerm=${encodeURIComponent(String(searchTerm))}`
  }

  Object.entries(otherParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryString += `&${key}=${encodeURIComponent(String(value))}`
    }
  })

  return queryString
}

// Export axios instance and token helpers
export { api, getToken, setToken, removeToken }

