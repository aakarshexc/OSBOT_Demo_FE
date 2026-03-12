import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'
import { formatCurrency } from '@/utils/utils'
import type { SummaryData } from '@/lib/analytics-api'

interface ProjectedValuesChartProps {
    data: SummaryData
}

export function ProjectedValuesChart({ data }: ProjectedValuesChartProps) {
    return (
        <Card className="overflow-hidden border border-border/60 shadow-sm rounded-xl max-w-full">
            <CardHeader className="border-b bg-muted/20">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
                    <CardTitle className="text-base font-bold 2xl:text-lg">Projected Values by Phase</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 2xl:p-8 max-w-full">
                {/* Stacked Bar Chart */}
                <div className="mb-6 w-full max-w-full overflow-hidden">
                    <ChartContainer
                        config={{
                            actual: {
                                label: "Actual Value",
                                color: "oklch(0.65 0.13 70)",
                            },
                            future: {
                                label: "Future Value",
                                color: "oklch(0.35 0.02 264.695)",
                            },
                        }}
                        className="h-[400px] w-full max-w-full 2xl:h-[500px]"
                    >
                        <BarChart
                            data={data.caseValues
                                .map(item => ({
                                    phase: item.case_phase || 'Unknown',
                                    actual: typeof item.projected_actual_value === 'string'
                                        ? parseFloat(item.projected_actual_value)
                                        : item.projected_actual_value || 0,
                                    future: typeof item.projected_future_value === 'string'
                                        ? parseFloat(item.projected_future_value)
                                        : item.projected_future_value || 0,
                                }))
                                .filter(item => item.actual > 0 || item.future > 0)
                            }
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.929 0.013 255.508)" />
                            <XAxis
                                dataKey="phase"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                tick={{ fontSize: 11 }}
                                stroke="oklch(0.25 0.02 264.695)"
                            />
                            <YAxis
                                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                stroke="oklch(0.25 0.02 264.695)"
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                                formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                            />
                            <Legend />
                            <Bar
                                dataKey="actual"
                                stackId="1"
                                fill="oklch(0.65 0.13 70)"
                                radius={[0, 0, 0, 0]}
                            />
                            <Bar
                                dataKey="future"
                                stackId="1"
                                fill="oklch(0.35 0.02 264.695)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
