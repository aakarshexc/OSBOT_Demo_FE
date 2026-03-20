import { Bot } from 'lucide-react'

interface PageBrandingProps {
  title: string
  description?: string
}

export function PageBranding({ title, description }: PageBrandingProps) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Bot className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-lg font-heading font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
