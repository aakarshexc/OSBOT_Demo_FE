/**
 * Application configuration constants
 * Reads from environment variables with sensible defaults
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SettleAssist'

export const APP_CONFIG = {
  name: APP_NAME,
} as const
