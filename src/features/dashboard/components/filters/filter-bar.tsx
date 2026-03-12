import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterBarProps {
    children: ReactNode
    onClear?: () => void
    hasActiveFilters?: boolean
}

export function FilterBar({ children, onClear, hasActiveFilters }: FilterBarProps) {
    return (
        <Card className="mb-4">
            <CardContent className="py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                        {children}
                    </div>
                    {hasActiveFilters && onClear && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClear}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

