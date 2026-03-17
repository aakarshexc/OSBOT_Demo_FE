import { useState, useEffect, useRef } from 'react'
import {
    MessageCircle,
    Mic,
    Send,
    X,
    Bot,
    User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axios from 'axios'
import showdown from 'showdown'
import { useAuthStore } from '@/stores/auth-store'
import SkinnerVoiceAssistant from './skinner-voice-assistant'
import '@livekit/components-styles'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const markdownConverter = new showdown.Converter({
    simplifiedAutoLink: true,
    simpleLineBreaks: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    openLinksInNewWindow: true,
})

function generateCallId(): string {
    return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function SkinnerBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<'chat' | 'voice'>('chat')
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi, I am Ellie, your Personal Assistant VoiceBot for your PI Business. You can ask me any questions related to PI operations in your business. Looking forward to help you.",
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [callId, setCallId] = useState(generateCallId())
    const scrollRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const shouldAutoScrollRef = useRef(true)
    const { user } = useAuthStore()

    // Reset chat when closed
    const toggleChat = () => {
        if (isOpen) {
            // Reset state
            setMessages([
                {
                    role: 'assistant',
                    content: "Hi, I'm Ellie Bot. I can provide insights related to prospects, matters, marketing, and finances. How can I help you today?",
                },
            ])
            setInput('')
            setCallId(generateCallId())
        }
        setIsOpen(!isOpen)
    }

    const botApiUrl = import.meta.env.VITE_CHAT_API_URL || 'https://osbot.voice.exceleratelegal.com/v1/chat/completions'
    const customerNumber = '+14086221882' // Default as requested

    useEffect(() => {
        if (scrollRef.current && shouldAutoScrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleMessagesScroll = () => {
        const container = messagesContainerRef.current
        if (!container) return

        const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight
        shouldAutoScrollRef.current = distanceFromBottom < 80
    }

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: 'user', content: input.trim() }
        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput('')
        setIsLoading(true)

        try {
            const payload = {
                call: { id: callId },
                id: callId,
                customer: { number: customerNumber },
                number: customerNumber,
                messages: updatedMessages,
                metadata: {
                    rawCallerPhone: customerNumber,
                    vapiCallId: callId,
                    userName: user?.name,
                    userEmail: user?.email
                },
                model: 'default'
            }

            const response = await axios.post(botApiUrl, payload)
            const botResponse = response.data.choices?.[0]?.message?.content

            if (botResponse) {
                setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }])
            }
        } catch (error) {
            console.log('Chat API Error:', error)
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen ? (
                <Card
                    className="mb-4 w-[400px] h-[560px] shadow-2xl border border-border/60 rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
                                <AvatarImage src="/bot-avatar.png" />
                                <AvatarFallback className="bg-primary-foreground text-primary">
                                    <Bot className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base font-bold">Ellie Bot</CardTitle>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                                onClick={toggleChat}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>

                    <div className="px-4 py-2 border-b bg-muted/20">
                        <Tabs value={mode} onValueChange={(v) => setMode(v as 'chat' | 'voice')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-9 rounded-lg">
                                <TabsTrigger value="chat" className="text-xs gap-2">
                                    <MessageCircle className="h-3.5 w-3.5" /> Chat
                                </TabsTrigger>
                                <TabsTrigger value="voice" className="text-xs gap-2">
                                    <Mic className="h-3.5 w-3.5" /> Voice
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <CardContent className="flex-1 p-4 overflow-hidden flex flex-col bg-background">
                        {mode === 'chat' ? (
                            <div
                                ref={messagesContainerRef}
                                onScroll={handleMessagesScroll}
                                className="flex-1 overflow-y-auto overscroll-contain pr-2 min-h-0"
                            >
                                <div className="space-y-5 pr-2">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                                                    {msg.role === 'user' ? (
                                                        <>
                                                            <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">
                                                                <User className="h-3.5 w-3.5" />
                                                            </AvatarFallback>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                                                                <Bot className="h-3.5 w-3.5" />
                                                            </AvatarFallback>
                                                        </>
                                                    )}
                                                </Avatar>
                                                <div
                                                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm max-w-full ${msg.role === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                        : 'bg-muted/80 text-foreground rounded-tl-sm border border-border/40'
                                                        }`}
                                                >
                                                    {msg.role === 'assistant' ? (
                                                        <div
                                                            className="prose prose-sm dark:prose-invert max-w-none wrap-break-word whitespace-pre-wrap"
                                                            dangerouslySetInnerHTML={{
                                                                __html: markdownConverter.makeHtml(msg.content),
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="wrap-break-word whitespace-pre-wrap">{msg.content}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-2 max-w-[85%]">
                                                <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                                                        <Bot className="h-3.5 w-3.5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="bg-muted/80 text-foreground rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm border border-border/40 flex gap-1.5 items-center">
                                                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <span className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </div>
                        ) : (
                            <SkinnerVoiceAssistant key={import.meta.env.VITE_LIVEKIT_AGENT_ID ?? 'voice'} />
                        )}
                    </CardContent>

                    {mode === 'chat' && (
                        <CardFooter className="p-4 border-t bg-muted/10">
                            <form
                                className="flex w-full items-center gap-3"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }}
                            >
                                <Input
                                    placeholder="Ask me anything..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-1 bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl h-10"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !input.trim()}
                                    className="h-10 w-10 shrink-0 rounded-xl transition-transform active:scale-95"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    )}
                </Card>
            ) : null}

            <Button
                onClick={toggleChat}
                className={`h-14 w-auto rounded-full shadow-xl gap-3 px-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 ${isOpen ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
                    }`}
            >
                <div className="relative">
                    <MessageCircle className="h-6 w-6" />
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground"></span>
                        </span>
                    )}
                </div>
                <span className="font-bold text-sm">Ellie Bot</span>
            </Button>
        </div>
    )
}
