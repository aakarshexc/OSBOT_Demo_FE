import { Users, FileText, Activity, DollarSign } from 'lucide-react'
import { HeroCard } from './hero-card'
import { formatCurrency, formatNumber } from '@/utils/utils'
import type { SummaryData } from '@/lib/analytics-api'

interface DashboardHeroSectionProps {
    data: SummaryData
}

export function DashboardHeroSection({ data }: DashboardHeroSectionProps) {
    return (
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
    )
}
