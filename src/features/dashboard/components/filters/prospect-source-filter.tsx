import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ProspectSourceFilterProps {
    sources: Array<{ lead_source: string }>
    value?: string
    onChange: (value: string) => void
}

export function ProspectSourceFilter({
    sources,
    value,
    onChange,
}: ProspectSourceFilterProps) {
    return (
        <div className="flex flex-col gap-2 min-w-[200px]">
            <Label className="text-xs text-muted-foreground">Source</Label>
            <Select value={value || 'all'} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((source) => (
                        <SelectItem key={source.lead_source} value={source.lead_source}>
                            {source.lead_source}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

