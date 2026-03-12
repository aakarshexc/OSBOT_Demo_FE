
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { cn, formatNumber } from '@/utils/utils'
import type { SummaryData } from '@/lib/analytics-api'

interface TreatmentLevelsProps {
    data: SummaryData
}

export function TreatmentLevels({ data }: TreatmentLevelsProps) {
    return (
        <Card className="border border-border/60 shadow-sm overflow-hidden rounded-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 2xl:text-xl">
                    <CheckCircle2 className="h-5 w-5 text-primary 2xl:h-6 2xl:w-6" />
                    Treatment Levels
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Object.entries(data.treatmentLevels)
                        .map(([name, value]) => {
                            const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0
                            const total = Object.values(data.treatmentLevels).reduce((sum, v) => {
                                const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0
                                return sum + num
                            }, 0)
                            const percentage = total > 0 ? (numValue / total) * 100 : 0

                            return { name, value: numValue, percentage }
                        })
                        .filter(item => item.value > 0)
                        .sort((a, b) => b.value - a.value)
                        .map((item, index) => {
                            const colors = [
                                'from-primary/20 to-primary/10',
                                'from-primary/15 to-primary/5',
                                'from-primary/10 to-primary/5',
                            ]
                            const colorClass = colors[index % colors.length]

                            return (
                                <div
                                    key={item.name}
                                    className={cn(
                                        "group relative overflow-hidden rounded-lg border bg-gradient-to-br p-5 transition-all hover:shadow-lg hover:scale-[1.02] 2xl:p-6",
                                        colorClass,
                                        "border-primary/20 hover:border-primary/40"
                                    )}
                                >
                                    <div className="relative z-10 flex flex-col gap-4">
                                        <h4 className="text-sm font-semibold text-foreground line-clamp-2">
                                            {item.name}
                                        </h4>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-primary tabular-nums">
                                                    {formatNumber(item.value)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">Share:</span>
                                                <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary">
                                                    {item.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </CardContent>
        </Card>
    )
}
