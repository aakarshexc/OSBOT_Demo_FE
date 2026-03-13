/**
 * Application configuration constants
 * Reads from environment variables with sensible defaults
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'PIN BOT'

export const APP_CONFIG = {
  name: APP_NAME,
} as const
