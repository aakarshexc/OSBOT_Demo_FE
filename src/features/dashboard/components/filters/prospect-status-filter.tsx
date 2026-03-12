import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ProspectStatusFilterProps {
    statuses: Array<{ intake_status: string }>
    value?: string
    onChange: (value: string) => void
}

export function ProspectStatusFilter({
    statuses,
    value,
    onChange,
}: ProspectStatusFilterProps) {
    return (
        <div className="flex flex-col gap-2 min-w-[200px]">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={value || 'all'} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                        <SelectItem key={status.intake_status} value={status.intake_status}>
                            {status.intake_status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

