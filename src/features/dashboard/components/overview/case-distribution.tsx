import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, FileText } from 'lucide-react'
import { cn, formatNumber } from '@/utils/utils'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'
import type { SummaryData } from '@/lib/analytics-api'

interface CaseDistributionChartsProps {
    data: SummaryData
}

export function CaseDistributionCharts({ data }: CaseDistributionChartsProps) {
    // Responsive pie chart sizing
    const [screenSize, setScreenSize] = useState({ width: 1920, is4K: false, isLargeScreen: false })

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth
            setScreenSize({
                width,
                is4K: width >= 2560,
                isLargeScreen: width >= 1920 && width < 2560
            })
        }
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    const pieOuterRadius = screenSize.is4K ? 200 : screenSize.isLargeScreen ? 190 : 170
    const pieInnerRadius = screenSize.is4K ? 100 : screenSize.isLargeScreen ? 95 : 85
    const pieChartHeight = screenSize.is4K ? 'h-[600px]' : screenSize.isLargeScreen ? 'h-[600px]' : 'h-[550px]'

    const getColor = (index: number) => {
        const colors = [
            'oklch(0.62 0.10 70)',      // Rich amber
            'oklch(0.52 0.09 55)',      // Deep caramel
            'oklch(0.46 0.07 45)',      // Warm umber
            'oklch(0.40 0.06 35)',      // Espresso
            'oklch(0.34 0.05 30)',      // Dark cocoa
            'oklch(0.68 0.08 80)',      // Sand
            'oklch(0.58 0.07 75)',      // Muted gold
            'oklch(0.50 0.06 85)',      // Olive-gold
            'oklch(0.30 0.03 20)',      // Charcoal brown
            'oklch(0.72 0.06 90)',      // Light wheat
            'oklch(0.55 0.07 60)',      // Walnut
            'oklch(0.44 0.05 25)',      // Toasted chestnut
        ]
        return colors[index % colors.length]
    }

    const renderDonutChart = (
        title: string,
        icon: React.ReactNode,
        chartDataSource: Record<string, number | string>
    ) => {
        const chartData = Object.entries(chartDataSource)
            .map(([name, value]) => {
                const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                return { name, value: numValue }
            })
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)

        const total = chartData.reduce((sum, item) => sum + item.value, 0)

        // If no data, render empty state or hidden? Assuming data fits if passed.
        if (total === 0) return null // Simplified handling

        return (
            <Card className="border border-border/60 shadow-sm overflow-hidden bg-card max-w-full hover:shadow-lg rounded-xl transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b pb-2.5 pt-3 px-4">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                        <div className="p-1.5 rounded-md bg-primary/10">
                            {icon}
                        </div>
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 max-w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-full">
                        {/* Donut Chart */}
                        <div className={cn("flex items-center justify-center relative max-w-full overflow-visible", pieChartHeight)}>
                            <div className="relative w-full h-full flex items-center justify-center">
                                <ChartContainer
                                    config={chartData.reduce((acc, item, index) => {
                                        acc[item.name] = {
                                            label: item.name,
                                            color: getColor(index),
                                        }
                                        return acc
                                    }, {} as Record<string, { label: string; color: string }>)}
                                    className={cn("w-full max-w-full absolute inset-0", pieChartHeight)}
                                >
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={false}
                                            outerRadius={pieOuterRadius}
                                            innerRadius={pieInnerRadius}
                                            dataKey="value"
                                            paddingAngle={0}
                                            stroke="none"
                                            strokeWidth={0}
                                        >
                                            {chartData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={getColor(index)}
                                                    stroke="none"
                                                    strokeWidth={0}
                                                    style={{
                                                        cursor: 'pointer',
                                                        transition: 'opacity 0.2s'
                                                    }}
                                                />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload
                                                    const percentage = total > 0 ? (data.value / total) * 100 : 0
                                                    return (
                                                        <div className="rounded-lg border bg-card p-3 shadow-lg">
                                                            <p className="font-semibold text-foreground">{data.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {formatNumber(data.value)} ({percentage.toFixed(2)}%)
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                    </PieChart>
                                </ChartContainer>
                                {/* Center Total */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div className="text-center">
                                        <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Record Count</div>
                                        <div className="text-4xl font-bold text-foreground 2xl:text-5xl">{formatNumber(total)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-col justify-center max-w-full bg-muted/20 rounded-lg p-3 border border-border/50">
                            <div className="text-xs font-semibold text-foreground mb-2 pb-1.5 border-b border-border">
                                Phase Breakdown
                            </div>
                            <div className={cn("grid grid-cols-1 gap-1 overflow-y-auto min-w-0 pr-1", "max-h-[550px] lg:max-h-[600px]")}>
                                {chartData.map((item, index) => {
                                    const percentage = total > 0 ? (item.value / total) * 100 : 0
                                    return (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-background transition-all group border border-transparent hover:border-border/50"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div
                                                    className="w-3 h-3 rounded shrink-0 shadow-sm ring-1 ring-black/5"
                                                    style={{ backgroundColor: getColor(index) }}
                                                />
                                                <span className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 ml-2 shrink-0">
                                                <span className="text-xs font-semibold text-foreground tabular-nums">
                                                    {formatNumber(item.value)}
                                                </span>
                                                <span className="text-xs text-muted-foreground w-12 text-right font-medium bg-muted/50 px-1.5 py-0.5 rounded">
                                                    {percentage.toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            {renderDonutChart("Active Cases by Phase", <Activity className="h-4 w-4 text-primary" />, data.activeCasesByPhase)}
            {renderDonutChart("All Case Phases", <FileText className="h-4 w-4 text-primary" />, data.casePhases)}
        </div>
    )
}
