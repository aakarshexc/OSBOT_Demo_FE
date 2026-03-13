import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Gavel, CheckCircle2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, Line } from 'recharts'
import { formatCurrency, formatNumber } from '@/utils/utils'
import type { SummaryData } from '@/lib/analytics-api'

interface FinancialPerformanceProps {
    data: SummaryData
}

export function FinancialPerformance({ data }: FinancialPerformanceProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Financial Performance</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                {/* Pipeline */}
                <Card className="overflow-hidden border border-border/60 shadow-sm rounded-xl max-w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/20 border-b">
                        <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        {/* Stacked Bar Chart for Pipeline Value */}
                        <div className="mb-4 w-full max-w-full overflow-hidden">
                            <ChartContainer
                                config={{
                                    conservativeFee: {
                                        label: "Conservative Fee",
                                        color: "oklch(0.65 0.13 70)",
                                    },
                                    llfFee: {
                                        label: "Total Attorney Fee",
                                        color: "oklch(0.55 0.12 70)",
                                    },
                                }}
                                className="h-[200px] w-full max-w-full"
                            >
                                <BarChart
                                    data={[{
                                        name: "Pipeline Value",
                                        conservativeFee: typeof data.PipelineValue.conservative_attorney_fee === 'string'
                                            ? parseFloat(data.PipelineValue.conservative_attorney_fee)
                                            : data.PipelineValue.conservative_attorney_fee || 0,
                                        llfFee: typeof data.PipelineValue.total_attorney_fee === 'string'
                                            ? parseFloat(data.PipelineValue.total_attorney_fee)
                                            : data.PipelineValue.total_attorney_fee || 0,
                                    }]}
                                    margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        tick={false}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                        formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                                    />
                                    <Legend />
                                    <Bar dataKey="conservativeFee" stackId="1" fill="oklch(0.65 0.13 70)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="llfFee" stackId="1" fill="oklch(0.55 0.12 70)" radius={[0, 0, 4, 4]} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Conservative Fee</span>
                                <span className="text-lg font-bold">{formatCurrency(data.PipelineValue.conservative_attorney_fee)}</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Attorney Fee</span>
                                <span className="text-lg font-bold">{formatCurrency(data.PipelineValue.total_attorney_fee)}</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-sm font-semibold text-foreground">Total Pipeline Value</span>
                                <span className="text-xl font-bold text-primary">
                                    {formatCurrency(data.PipelineValue.total_pipeline_value)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Litigation */}
                <Card className="overflow-hidden border border-border/60 shadow-sm rounded-xl max-w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/20 border-b">
                        <CardTitle className="text-sm font-medium">Litigation</CardTitle>
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        {/* Composed Chart for Litigation - showing Actual, Future, and Count */}
                        <div className="mb-4 w-full max-w-full overflow-hidden">
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
                                    count: {
                                        label: "Count",
                                        color: "oklch(0.50 0.12 55)",
                                    },
                                }}
                                className="h-[200px] w-full max-w-full"
                            >
                                <ComposedChart
                                    data={[{
                                        name: "Litigation",
                                        actual: typeof data.litigationValue.projected_actual_value === 'string'
                                            ? parseFloat(data.litigationValue.projected_actual_value)
                                            : data.litigationValue.projected_actual_value || 0,
                                        future: typeof data.litigationValue.projected_future_value === 'string'
                                            ? parseFloat(data.litigationValue.projected_future_value)
                                            : data.litigationValue.projected_future_value || 0,
                                        count: typeof data.litigationValue.litigation_count === 'string'
                                            ? parseFloat(data.litigationValue.litigation_count)
                                            : data.litigationValue.litigation_count || 0,
                                    }]}
                                    margin={{ left: 20, right: 60, top: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        yAxisId="left"
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tickFormatter={(value) => formatNumber(value)}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent
                                            formatter={(value: number | string, name: string) => {
                                                const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                                                if (name === 'count') {
                                                    return [formatNumber(numValue), 'Count']
                                                }
                                                return [formatCurrency(numValue), name]
                                            }}
                                        />}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="actual" fill="oklch(0.65 0.13 70)" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="left" dataKey="future" fill="oklch(0.35 0.02 264.695)" radius={[4, 4, 0, 0]} />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="count"
                                        stroke="oklch(0.50 0.12 55)"
                                        strokeWidth={3}
                                        dot={{ fill: "oklch(0.50 0.12 55)", r: 5 }}
                                    />
                                </ComposedChart>
                            </ChartContainer>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Projected Actual Value</span>
                                <span className="text-sm font-semibold">{formatCurrency(data.litigationValue.projected_actual_value)}</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Projected Future Value</span>
                                <span className="text-sm font-semibold">{formatCurrency(data.litigationValue.projected_future_value)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Count</span>
                                <span className="text-sm font-semibold">{formatNumber(data.litigationValue.litigation_count)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Settlement */}
                <Card className="overflow-hidden border border-border/60 shadow-sm rounded-xl max-w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/20 border-b">
                        <CardTitle className="text-sm font-medium">Settlement Value</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        {/* Composed Chart for Settlement - showing Actual, Future, and Count */}
                        <div className="mb-4 w-full max-w-full overflow-hidden">
                            <ChartContainer
                                config={{
                                    demandOffer: {
                                        label: "Demand Offer Amount",
                                        color: "oklch(0.65 0.13 70)",
                                    },
                                    llfFee: {
                                        label: "LLF Attorney Fee",
                                        color: "oklch(0.55 0.12 70)",
                                    },
                                    count: {
                                        label: "Count",
                                        color: "oklch(0.50 0.12 55)",
                                    },
                                }}
                                className="h-[200px] w-full max-w-full"
                            >
                                <ComposedChart
                                    data={[{
                                        name: "Settlement",
                                        demandOffer: typeof data.SettlementValue.demand_offer_amount_total === 'string'
                                            ? parseFloat(data.SettlementValue.demand_offer_amount_total)
                                            : data.SettlementValue.demand_offer_amount_total || 0,
                                        llfFee: typeof data.SettlementValue.llf_attorney_fee_total === 'string'
                                            ? parseFloat(data.SettlementValue.llf_attorney_fee_total)
                                            : data.SettlementValue.llf_attorney_fee_total || 0,
                                        count: typeof data.SettlementValue.total_settlement_count === 'string'
                                            ? parseFloat(data.SettlementValue.total_settlement_count)
                                            : data.SettlementValue.total_settlement_count || 0,
                                    }]}
                                    margin={{ left: 20, right: 60, top: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis
                                        yAxisId="left"
                                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tickFormatter={(value) => formatNumber(value)}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent
                                            formatter={(value: number | string, name: string) => {
                                                const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                                                if (name === 'count') {
                                                    return [formatNumber(numValue), 'Count']
                                                }
                                                return [formatCurrency(numValue), name]
                                            }}
                                        />}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="demandOffer" fill="oklch(0.65 0.13 70)" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="left" dataKey="llfFee" fill="oklch(0.55 0.12 70)" radius={[4, 4, 0, 0]} />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="count"
                                        stroke="oklch(0.50 0.12 55)"
                                        strokeWidth={3}
                                        dot={{ fill: "oklch(0.50 0.12 55)", r: 5 }}
                                    />
                                </ComposedChart>
                            </ChartContainer>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Demand Offer Amount</span>
                                <span className="text-lg font-bold">{formatCurrency(data.SettlementValue.demand_offer_amount_total)}</span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">LLF Attorney Fee Total</span>
                                <span className="text-sm font-semibold">{formatCurrency(data.SettlementValue.llf_attorney_fee_total)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Settlement Count</span>
                                <span className="text-sm font-semibold">{formatNumber(data.SettlementValue.total_settlement_count)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
