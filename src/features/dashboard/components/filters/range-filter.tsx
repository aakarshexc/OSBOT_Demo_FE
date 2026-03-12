import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/hooks/use-debounce'

interface RangeFilterProps {
    label: string
    min: number
    max: number
    minValue?: number
    maxValue?: number
    onMinChange: (value: number | undefined) => void
    onMaxChange: (value: number | undefined) => void
}

export function RangeFilter({
    label,
    min,
    max,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
}: RangeFilterProps) {
    const [localMinValue, setLocalMinValue] = useState<string>(minValue?.toString() || '')
    const [localMaxValue, setLocalMaxValue] = useState<string>(maxValue?.toString() || '')
    
    const debouncedMinValue = useDebounce(localMinValue, 500)
    const debouncedMaxValue = useDebounce(localMaxValue, 500)

    // Update local state when prop changes
    useEffect(() => {
        setLocalMinValue(minValue?.toString() || '')
    }, [minValue])

    useEffect(() => {
        setLocalMaxValue(maxValue?.toString() || '')
    }, [maxValue])

    // Apply debounced values
    useEffect(() => {
        const numValue = debouncedMinValue ? parseFloat(debouncedMinValue) : undefined
        if (numValue !== minValue && (debouncedMinValue === '' || !isNaN(parseFloat(debouncedMinValue)))) {
            onMinChange(numValue)
        }
    }, [debouncedMinValue, minValue, onMinChange])

    useEffect(() => {
        const numValue = debouncedMaxValue ? parseFloat(debouncedMaxValue) : undefined
        if (numValue !== maxValue && (debouncedMaxValue === '' || !isNaN(parseFloat(debouncedMaxValue)))) {
            onMaxChange(numValue)
        }
    }, [debouncedMaxValue, maxValue, onMaxChange])

    return (
        <div className="flex flex-col gap-2 min-w-[250px]">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder={`Min: ${min.toLocaleString()}`}
                        value={localMinValue}
                        onChange={(e) => {
                            setLocalMinValue(e.target.value)
                        }}
                        min={min}
                        max={max}
                        className="w-full"
                    />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder={`Max: ${max.toLocaleString()}`}
                        value={localMaxValue}
                        onChange={(e) => {
                            setLocalMaxValue(e.target.value)
                        }}
                        min={min}
                        max={max}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}

