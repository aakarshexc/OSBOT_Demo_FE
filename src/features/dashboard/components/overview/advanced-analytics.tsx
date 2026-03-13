import { Clock, DollarSign, Percent, FileText } from 'lucide-react'
import { HeroCard } from './hero-card'
import { formatCurrency } from '@/utils/utils'
import type { SummaryData } from '@/lib/analytics-api'

interface AdvancedAnalyticsProps {
    data: SummaryData
}

export function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Advanced Analytics Metrics</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <HeroCard
                    title="Time on Desk (Days)"
                    value={data.timeOnDeskDays}
                    icon={Clock}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                />
                <HeroCard
                    title="Average Value Per Case"
                    value={formatCurrency(data.averageValuePerCase)}
                    icon={DollarSign}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                />
                <HeroCard
                    title="Case Velocity"
                    value={data.caseVelocityDays}
                    icon={Clock}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                />
                <HeroCard
                    title="Advanced Client Cost Recovery Rate"
                    value={data.advancedClientCostRecoveryRate}
                    icon={Percent}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                />
                <HeroCard
                    title="Demand Offer Amount"
                    value={formatCurrency(data.demandValue.demand_offer_amount_total)}
                    icon={FileText}
                    colorClass="text-primary"
                    bgClass="bg-primary/10"
                />
            </div>
        </div>
    )
}
