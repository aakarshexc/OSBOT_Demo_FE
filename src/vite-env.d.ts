/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_API_URL: string
  readonly VITE_LIVEKIT_URL: string
  readonly VITE_LIVEKIT_AGENT_ID: string
  readonly VITE_LIVEKIT_TOKEN_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
