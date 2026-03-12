import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface PhaseFilterProps {
    phases: Array<{ case_phase: string }>
    value?: string
    onChange: (value: string) => void
}

export function PhaseFilter({ phases, value, onChange }: PhaseFilterProps) {
    return (
        <div className="flex flex-col gap-2 min-w-[200px]">
            <Label className="text-xs text-muted-foreground">Phase</Label>
            <Select value={value || 'all'} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Phases" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    {phases.map((phase) => (
                        <SelectItem key={phase.case_phase} value={phase.case_phase}>
                            {phase.case_phase}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

