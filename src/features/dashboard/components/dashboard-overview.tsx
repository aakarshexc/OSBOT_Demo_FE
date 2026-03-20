import { useSummary } from '../hooks/use-analytics'
import { DashboardHeroSection } from './overview/overview-hero'
import { FinancialPerformance } from './overview/financial-performance'
import { AdvancedAnalytics } from './overview/advanced-analytics'
import { CaseDistributionCharts } from './overview/case-distribution'
import { TreatmentLevels } from './overview/treatment-levels'
import { ProjectedValuesChart } from './overview/projected-values'

interface DashboardOverviewProps {
    startDate: string
    endDate: string
}

export function DashboardOverview({ startDate, endDate }: DashboardOverviewProps) {
    const { data: response, isLoading } = useSummary(startDate, endDate)
    const data = response?.data

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[400px] gap-6'>
                <div className="flex flex-col items-center gap-5">
                    <div className='animate-spin rounded-full h-12 w-12 border-2 border-primary/30 border-t-primary'></div>
                    <p className="text-sm text-muted-foreground font-medium">Loading your PI firm stats...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-10 pb-12 w-full">
            {/* 1. Hero Section */}
            <DashboardHeroSection data={data} />

            {/* 2. Financial Overview Section */}
            <FinancialPerformance data={data} />

            {/* 3. Advanced Analytics Metrics Section */}
            <AdvancedAnalytics data={data} />

            {/* 4. Modern Visualizations Section */}
            <CaseDistributionCharts data={data} />

            {/* 5. Treatment Levels */}
            <TreatmentLevels data={data} />

            {/* 6. Projected Values Table */}
            <ProjectedValuesChart data={data} />
        </div>
    )
}
