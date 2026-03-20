import { Users, FileText, Activity, DollarSign, BarChart3 } from 'lucide-react'
import { HeroCard } from './hero-card'
import { formatCurrency, formatNumber } from '@/utils/utils'
import type { SummaryData } from '@/lib/analytics-api'

interface DashboardHeroSectionProps {
    data: SummaryData
}

export function DashboardHeroSection({ data }: DashboardHeroSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-xl font-heading font-semibold tracking-tight text-foreground">
                        Your PI Firm Stats
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Key metrics for prospects, matters, and case value
                    </p>
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5">
            <HeroCard
                title="Prospects"
                value={formatNumber(data.prospectCount)}
                subtext="Leads generated"
                icon={Users}
                colorClass="text-primary"
                bgClass="bg-primary/10"
            />
            <HeroCard
                title="Matters"
                value={formatNumber(data.matterCount)}
                subtext="Retainers signed"
                icon={FileText}
                colorClass="text-primary"
                bgClass="bg-primary/10"
            />
            <HeroCard
                title="Demands Sent"
                value={formatNumber(data.demandValue.demand_count)}
                subtext="Total demands"
                icon={FileText}
                colorClass="text-primary"
                bgClass="bg-primary/10"
            />
            <HeroCard
                title="Active Cases"
                value={formatNumber(data.activeCasesCount)}
                subtext="In progress"
                icon={Activity}
                colorClass="text-primary"
                bgClass="bg-primary/10"
            />
            <HeroCard
                title="Average Value Per Case"
                value={formatCurrency(data.averageValuePerCase)}
                subtext="Per case"
                icon={DollarSign}
                colorClass="text-primary"
                bgClass="bg-primary/10"
            />
            </div>
        </div>
    )
}
