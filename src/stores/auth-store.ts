import { create } from 'zustand'
import { setToken, removeToken, getToken } from '@/lib/api'
import { login, fetchMe, type MeUser } from '@/features/auth/services/authService'

export interface User {
  id: string
  userId: string
  email: string
  name: string
  role: string
  roleDescription: string
  clientId: string | null
  clientName: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  permissions: string[]
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  checkAuth: () => Promise<void>
}

const mapMeUserToUser = (meUser: MeUser): User => ({
  id: meUser.userId,
  userId: meUser.userId,
  email: meUser.email,
  name: meUser.name,
  role: meUser.role,
  roleDescription: meUser.roleDescription,
  clientId: meUser.clientId,
  clientName: meUser.clientName,
})

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    const token = getToken()
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return
    }

    try {
      // Validate token and fetch user profile
      const meData = await fetchMe(token)
      const user = mapMeUserToUser(meData.user)
      
      set({
        user,
        token,
        permissions: meData.permissions || [],
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      // Token is invalid, clear auth state
      removeToken()
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true })
      
      const response = await login({ email, password })
      const { token, user: apiUser } = response.data
      
      // Store token
      setToken(token)
      
      // Map API user to our User interface
      const user = mapMeUserToUser(apiUser)
      
      // Fetch permissions after login
      let permissions: string[] = []
      try {
        const meData = await fetchMe(token)
        permissions = meData.permissions || []
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
      }
      
      set({
        user,
        token,
        permissions,
        isAuthenticated: true,
        isLoading: false,
      })
      
      return true
    } catch (error) {
      set({
        user: null,
        token: null,
        permissions: [],
        isAuthenticated: false,
        isLoading: false,
      })
      
      // Re-throw error so calling component can handle it
      throw error
    }
  },

  signOut: () => {
    removeToken()
    set({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
    })
  },
}))

