import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BarVisualizer,
  RoomAudioRenderer,
  SessionProvider,
  useAgent,
  useLocalParticipant,
  useSession,
} from '@livekit/components-react'
import { TokenSource, type TokenSourceConfigurable, type TokenSourceFetchOptions } from 'livekit-client'
import { Loader2, Mic, MicOff, Radio } from 'lucide-react'
import { fetchLiveKitToken } from '@/lib/livekit-api'
import '@livekit/components-styles';

function buildParticipantName(): string {
  // Match backend's expected identity style.
  return `identity-${Math.random().toString(36).slice(2, 8)}`
}

function buildRoomName(): string {
  // Match backend's expected room style.
  return `playground-${Math.random().toString(36).slice(2, 8)}`
}

function AgentVoicePanel() {
  const agent = useAgent()
  const { microphoneTrack } = useLocalParticipant()

  const stateLabel = useMemo(() => {
    switch (agent.state) {
      case 'connecting':
        return 'Connecting to agent...'
      case 'pre-connect-buffering':
      case 'initializing':
        return 'Preparing voice session...'
      case 'listening':
        return 'Listening'
      case 'thinking':
        return 'Thinking'
      case 'speaking':
        return 'Speaking'
      case 'failed':
        return 'Connection failed'
      default:
        return 'Disconnected'
    }
  }, [agent.state])

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='rounded-xl border border-border/60 bg-muted/20 p-4 text-xs shadow-sm'>
        <div className='mb-2 flex items-center gap-2 font-semibold text-foreground'>
          <Radio className='h-4 w-4 text-primary' />
          Live voice status
        </div>
        <p className='text-muted-foreground font-medium'>{stateLabel}</p>
        {agent.failureReasons ? (
          <p className='mt-2 text-[11px] text-destructive'>
            Agent failure: {JSON.stringify(agent.failureReasons)}
          </p>
        ) : null}
      </div>

      <div className='flex min-h-[140px] items-center justify-center rounded-xl border border-border/60 bg-muted/10 p-4'>
        {agent.canListen && agent.microphoneTrack ? (
          <BarVisualizer track={agent.microphoneTrack} state={agent.state} barCount={9} />
        ) : (
          <p className='text-sm text-muted-foreground'>Waiting for agent audio...</p>
        )}
      </div>

      <div className='rounded-xl border border-border/60 bg-muted/20 p-4 text-xs shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground font-medium'>Your microphone</span>
          <span className='inline-flex items-center gap-2 font-semibold text-foreground'>
            {microphoneTrack?.isMuted ? (
              <>
                <MicOff className='h-4 w-4 text-muted-foreground' />
                Muted
              </>
            ) : (
              <>
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75' />
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-primary' />
                </span>
                <Mic className='h-4 w-4 text-primary' />
                Live
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function SkinnerVoiceAssistant() {
  const [voiceError, setVoiceError] = useState<string | null>(null)

  const [participantName] = useState(() => buildParticipantName())
  const [roomName] = useState(() => buildRoomName())
  const primaryAgentId = import.meta.env.VITE_LIVEKIT_AGENT_ID?.trim() || 'Payal'
  const configuredAgentName = import.meta.env.VITE_LIVEKIT_AGENT_NAME?.trim()
  const [activeAgentId, setActiveAgentId] = useState(primaryAgentId)
  const [hasRetriedAgentFallback, setHasRetriedAgentFallback] = useState(primaryAgentId === 'Payal')
  const fallbackServerUrl = import.meta.env.VITE_LIVEKIT_URL

  const tokenSource: TokenSourceConfigurable = useMemo(
    () =>
      TokenSource.custom(async (options) => {
        const resolvedParticipantName = options.participantName || participantName
        const resolvedRoomName = options.roomName || roomName
        const resolvedAgentId = options.agentName || activeAgentId
        const isLikelyAgentId = /^CA_/i.test(resolvedAgentId)

        const tokenResponse = await fetchLiveKitToken({
          participantName: resolvedParticipantName,
          roomName: resolvedRoomName,
          agentId: resolvedAgentId,
          // Only send agentName when we really have a name; CA_* should stay in agentId.
          agentName:
            configuredAgentName ||
            (!isLikelyAgentId ? resolvedAgentId : undefined),
        })

        const serverUrl = tokenResponse.serverUrl || fallbackServerUrl
        if (!serverUrl) {
          throw new Error('LiveKit server URL is missing. Set LIVEKIT_URL on backend or VITE_LIVEKIT_URL on frontend.')
        }

        return {
          participantToken: tokenResponse.token,
          serverUrl,
        }
      }),
    [activeAgentId, configuredAgentName, fallbackServerUrl, participantName, roomName]
  )

  const tokenOptions: TokenSourceFetchOptions = useMemo(
    () => ({
      roomName,
      participantName,
      agentName: activeAgentId,
    }),
    [activeAgentId, participantName, roomName]
  )

  const session = useSession(tokenSource, {
    ...tokenOptions,
    // Some agents take longer to cold-start than the default timeout.
    agentConnectTimeoutMilliseconds: 60000,
  })
  const startRef = useRef(session.start)
  const endRef = useRef(session.end)

  useEffect(() => {
    startRef.current = session.start
    endRef.current = session.end
  }, [session.start, session.end])

  useEffect(() => {
    let cancelled = false
    const abortController = new AbortController()

    const startSession = async () => {
      try {
        await startRef.current({
          signal: abortController.signal,
          tracks: {
            // Auto-enable mic, but disable preconnect buffering to avoid early publish edge-cases.
            microphone: {
              enabled: true,
              publishOptions: {
                preConnectBuffer: false,
              },
            },
            camera: { enabled: false },
            screenShare: { enabled: false },
          },
        })
        if (!cancelled) {
          setVoiceError(null)
        }
      } catch (error) {
        if (cancelled || abortController.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Unable to start LiveKit voice session.'

        // Retry once with known-good fallback agent regardless of error wording.
        if (!hasRetriedAgentFallback && activeAgentId !== 'Payal') {
          setHasRetriedAgentFallback(true)
          setActiveAgentId('Payal')
          setVoiceError(`Agent "${activeAgentId}" unavailable. Retrying with fallback agent...`)
          return
        }

        setVoiceError(message)
      }
    }

    void startSession()

    return () => {
      cancelled = true
      abortController.abort()
      endRef.current().catch(() => undefined)
    }
  }, [activeAgentId, hasRetriedAgentFallback])

  if (voiceError) {
    return (
      <div className='flex h-full items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center'>
        <p className='text-sm text-destructive font-medium'>{voiceError}</p>
      </div>
    )
  }

  return (
    <SessionProvider session={session}>
      <div data-lk-theme='default' className='flex h-full flex-col gap-4'>
        <div className='flex min-h-0 flex-1 flex-col'>
          {session.isConnected ? (
            <AgentVoicePanel />
          ) : (
            <div className='flex h-full items-center justify-center rounded-xl border border-border/60 bg-muted/10 p-6'>
              <div className='flex flex-col items-center gap-3 text-sm text-muted-foreground'>
                <Loader2 className='h-6 w-6 animate-spin text-primary' />
                <span className='font-medium'>Connecting to voice session...</span>
              </div>
            </div>
          )}
        </div>
        <RoomAudioRenderer />
      </div>
    </SessionProvider>
  )
}