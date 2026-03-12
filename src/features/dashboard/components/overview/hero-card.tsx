import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/utils'

export interface HeroCardProps {
    title: string
    value: string | number
    subtext?: string
    icon: React.ComponentType<{ className?: string }>
    colorClass?: string
    bgClass?: string
}

export const HeroCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: HeroCardProps) => (
    <Card className="border border-border/60 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-primary/20 bg-card rounded-xl overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-sm font-medium text-muted-foreground tracking-tight">{title}</span>
                <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</span>
                {subtext && <span className="text-xs text-muted-foreground/80">{subtext}</span>}
            </div>
            <div className={cn("p-3.5 rounded-xl shrink-0", bgClass)}>
                <Icon className={cn("h-5 w-5", colorClass)} />
            </div>
        </CardContent>
    </Card>
)
