import { Bot, Briefcase } from 'lucide-react'

interface DashboardBrandingProps {
  user?: { name?: string } | null
  children?: React.ReactNode
}

export function DashboardBranding({ user, children }: DashboardBrandingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-foreground truncate">
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Ellie Bot · Your PI practice assistant
            </span>
            <span className="hidden sm:inline text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-xs font-medium text-foreground">
              <Briefcase className="h-3 w-3 text-primary" />
              PI Firm
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
