import { useState, useMemo } from 'react'
import { DataTable } from './data-table'
import {
    useActiveCases,
    usePipelineValue,
    useSettlementCases,
    useLitigationCases,
    useProspects,
    useFilterOptions
} from '../hooks/use-analytics'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { activeCasesColumns } from './columns/active-cases-columns'
import { reportsColumns } from './columns/reports-columns'
import { settlementColumns } from './columns/settlement-columns'
import { litigationColumns } from './columns/litigation-columns'
import { prospectsColumns } from './columns/prospects-columns'
import { SortingState } from '@tanstack/react-table'
import { FilterBar } from './filters/filter-bar'
import { PhaseFilter } from './filters/phase-filter'
import { RangeFilter } from './filters/range-filter'
import { ProspectStatusFilter } from './filters/prospect-status-filter'
import { ProspectSourceFilter } from './filters/prospect-source-filter'
import { ProspectScoreFilter } from './filters/prospect-score-filter'
import type { ActiveCasesFilters, ReportsFilters, SettlementCasesFilters, LitigationCasesFilters, ProspectsFilters } from '@/lib/analytics-api'

// Helper formatter
const formatCurrency = (amount: string | number | null) => {
    if (amount === null || amount === undefined || amount === '') return '-'
    const val = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

interface TableProps {
    startDate: string
    endDate: string
}

export function ActiveCasesTable({ startDate, endDate }: TableProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [filters, setFilters] = useState<ActiveCasesFilters>({})
    
    const { data: filterOptions } = useFilterOptions()
    const { data, isLoading, isFetching } = useActiveCases(startDate, endDate, page, pageSize, filters)

    const hasActiveFilters = useMemo(() => {
        return !!(filters.phases && filters.phases !== 'all') || 
               filters.projectedValueMin !== undefined || 
               filters.projectedValueMax !== undefined ||
               filters.settlementValueMin !== undefined || 
               filters.settlementValueMax !== undefined
    }, [filters])

    const handleClearFilters = () => {
        setFilters({})
        setPage(1)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setPage(1)
    }

    // Calculate totalPages based on totalCount
    const totalPages = data?.pagination?.totalCount && pageSize
        ? Math.ceil(data.pagination.totalCount / pageSize)
        : (data?.pagination?.hasMore ? (data.pagination.page + 1) : (data?.pagination?.page || 1))

    return (
        <div className="space-y-4">
            {filterOptions?.data && (
                <FilterBar hasActiveFilters={hasActiveFilters} onClear={handleClearFilters}>
                    <PhaseFilter
                        phases={filterOptions.data.phases}
                        value={filters.phases}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, phases: value }))
                            setPage(1)
                        }}
                    />
                    <RangeFilter
                        label="Projected Value (Actual)"
                        min={filterOptions.data.caseValueRanges.projectedValueActual.min}
                        max={filterOptions.data.caseValueRanges.projectedValueActual.max}
                        minValue={filters.projectedValueMin}
                        maxValue={filters.projectedValueMax}
                        onMinChange={(value) => {
                            setFilters(prev => ({ ...prev, projectedValueMin: value }))
                        }}
                        onMaxChange={(value) => {
                            setFilters(prev => ({ ...prev, projectedValueMax: value }))
                        }}
                    />
                    <RangeFilter
                        label="Total Settlement Amount"
                        min={filterOptions.data.caseValueRanges.totalSettlementAmount.min}
                        max={filterOptions.data.caseValueRanges.totalSettlementAmount.max}
                        minValue={filters.settlementValueMin}
                        maxValue={filters.settlementValueMax}
                        onMinChange={(value) => {
                            setFilters(prev => ({ ...prev, settlementValueMin: value }))
                        }}
                        onMaxChange={(value) => {
                            setFilters(prev => ({ ...prev, settlementValueMax: value }))
                        }}
                    />
                </FilterBar>
            )}
            <DataTable
                title="Active Cases"
                data={data?.data || []}
                columns={activeCasesColumns}
                isLoading={isLoading || isFetching}
                pagination={data?.pagination}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                showPagination={true}
                currentPage={data?.pagination?.page || 1}
                totalPages={totalPages}
                totalRows={data?.pagination?.totalCount || data?.data?.length || 0}
                pageSize={pageSize}
                sorting={sorting}
                setSorting={setSorting}
                showColumnVisibility={true}
                paginationOptions={{
                    pageSizeOptions: [10, 20, 30, 40]
                }}
            />
        </div>
    )
}

export function ReportsTable({ startDate, endDate }: TableProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [filters, setFilters] = useState<ReportsFilters>({})
    
    const { data: filterOptions } = useFilterOptions()
    const { data, isLoading, isFetching } = usePipelineValue(startDate, endDate, page, pageSize, filters)

    const hasActiveFilters = useMemo(() => {
        return !!(filters.phases && filters.phases !== 'all')
    }, [filters])

    const handleClearFilters = () => {
        setFilters({})
        setPage(1)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setPage(1)
    }

    const totalPages = data?.pagination?.totalCount && pageSize
        ? Math.ceil(data.pagination.totalCount / pageSize)
        : (data?.pagination?.hasMore ? (data.pagination.page + 1) : (data?.pagination?.page || 1))

    return (
        <div className='space-y-4'>
            {/* Totals Summary */}
            {data?.totals && (
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Conservative Fee</CardTitle>
                            <div className="text-2xl font-bold">{formatCurrency(data.totals.total_conservative_attorney_fee as string | number | null)}</div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total LLF Fee</CardTitle>
                            <div className="text-2xl font-bold">{formatCurrency(data.totals.total_llf_attorney_fee as string | number | null)}</div>
                        </CardHeader>
                    </Card>
                </div>
            )}

            {filterOptions?.data && (
                <FilterBar hasActiveFilters={hasActiveFilters} onClear={handleClearFilters}>
                    <PhaseFilter
                        phases={filterOptions.data.phases}
                        value={filters.phases}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, phases: value }))
                            setPage(1)
                        }}
                    />
                </FilterBar>
            )}

            <DataTable
                title="Reports"
                data={data?.data || []}
                columns={reportsColumns}
                isLoading={isLoading || isFetching}
                pagination={data?.pagination}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                showPagination={true}
                currentPage={data?.pagination?.page || 1}
                totalPages={totalPages}
                totalRows={data?.pagination?.totalCount || data?.data?.length || 0}
                pageSize={pageSize}
                sorting={sorting}
                setSorting={setSorting}
                showColumnVisibility={true}
                paginationOptions={{
                    pageSizeOptions: [10, 20, 30, 40]
                }}
            />
        </div>
    )
}

export function SettlementCasesTable({ startDate, endDate }: TableProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [filters, setFilters] = useState<SettlementCasesFilters>({})
    
    const { data: filterOptions } = useFilterOptions()
    const { data, isLoading, isFetching } = useSettlementCases(startDate, endDate, page, pageSize, filters)

    const hasActiveFilters = useMemo(() => {
        return !!(filters.phases && filters.phases !== 'all') || 
               filters.projectedValueMin !== undefined || 
               filters.projectedValueMax !== undefined ||
               filters.settlementValueMin !== undefined || 
               filters.settlementValueMax !== undefined
    }, [filters])

    const handleClearFilters = () => {
        setFilters({})
        setPage(1)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setPage(1)
    }

    const totalPages = data?.pagination?.totalCount && pageSize
        ? Math.ceil(data.pagination.totalCount / pageSize)
        : (data?.pagination?.hasMore ? (data.pagination.page + 1) : (data?.pagination?.page || 1))

    return (
        <div className="space-y-4">
            {filterOptions?.data && (
                <FilterBar hasActiveFilters={hasActiveFilters} onClear={handleClearFilters}>
                    <PhaseFilter
                        phases={filterOptions.data.phases}
                        value={filters.phases}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, phases: value }))
                            setPage(1)
                        }}
                    />
                    <RangeFilter
                        label="Projected Value (Actual)"
                        min={filterOptions.data.caseValueRanges.projectedValueActual.min}
                        max={filterOptions.data.caseValueRanges.projectedValueActual.max}
                        minValue={filters.projectedValueMin}
                        maxValue={filters.projectedValueMax}
                        onMinChange={(value) => {
                            setFilters(prev => ({ ...prev, projectedValueMin: value }))
                        }}
                        onMaxChange={(value) => {
                            setFilters(prev => ({ ...prev, projectedValueMax: value }))
                        }}
                    />
                    <RangeFilter
                        label="Total Settlement Amount"
                        min={filterOptions.data.caseValueRanges.totalSettlementAmount.min}
                        max={filterOptions.data.caseValueRanges.totalSettlementAmount.max}
                        minValue={filters.settlementValueMin}
                        maxValue={filters.settlementValueMax}
                        onMinChange={(value) => {
                            setFilters(prev => ({ ...prev, settlementValueMin: value }))
                        }}
                        onMaxChange={(value) => {
                            setFilters(prev => ({ ...prev, settlementValueMax: value }))
                        }}
                    />
                </FilterBar>
            )}
            <DataTable
                title="Settlement Cases"
                data={data?.data || []}
                columns={settlementColumns}
                isLoading={isLoading || isFetching}
                pagination={data?.pagination}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                showPagination={true}
                currentPage={data?.pagination?.page || 1}
                totalPages={totalPages}
                totalRows={data?.pagination?.totalCount || data?.data?.length || 0}
                pageSize={pageSize}
                sorting={sorting}
                setSorting={setSorting}
                showColumnVisibility={true}
                paginationOptions={{
                    pageSizeOptions: [10, 20, 30, 40]
                }}
            />
        </div>
    )
}

export function LitigationCasesTable({ startDate, endDate }: TableProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [filters, setFilters] = useState<LitigationCasesFilters>({})
    
    const { data: filterOptions } = useFilterOptions()
    const { data, isLoading, isFetching } = useLitigationCases(startDate, endDate, page, pageSize, filters)

    const hasActiveFilters = useMemo(() => {
        return !!(filters.phases && filters.phases !== 'all')
    }, [filters])

    const handleClearFilters = () => {
        setFilters({})
        setPage(1)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setPage(1)
    }

    const totalPages = data?.pagination?.totalCount && pageSize
        ? Math.ceil(data.pagination.totalCount / pageSize)
        : (data?.pagination?.hasMore ? (data.pagination.page + 1) : (data?.pagination?.page || 1))

    return (
        <div className="space-y-4">
            {filterOptions?.data && (
                <FilterBar hasActiveFilters={hasActiveFilters} onClear={handleClearFilters}>
                    <PhaseFilter
                        phases={filterOptions.data.phases}
                        value={filters.phases}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, phases: value }))
                            setPage(1)
                        }}
                    />
                </FilterBar>
            )}
            <DataTable
                title="Litigation Cases"
                data={data?.data || []}
                columns={litigationColumns}
                isLoading={isLoading || isFetching}
                pagination={data?.pagination}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                showPagination={true}
                currentPage={data?.pagination?.page || 1}
                totalPages={totalPages}
                totalRows={data?.pagination?.totalCount || data?.data?.length || 0}
                pageSize={pageSize}
                sorting={sorting}
                setSorting={setSorting}
                showColumnVisibility={true}
                paginationOptions={{
                    pageSizeOptions: [10, 20, 30, 40]
                }}
            />
        </div>
    )
}

export function ProspectsTable({ startDate, endDate }: TableProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [filters, setFilters] = useState<ProspectsFilters>({})
    
    const { data: filterOptions } = useFilterOptions()
    const { data, isLoading, isFetching } = useProspects(startDate, endDate, page, pageSize, filters)

    const hasActiveFilters = useMemo(() => {
        return !!(filters.status && filters.status !== 'all') || 
               !!(filters.source && filters.source !== 'all') ||
               filters.scoreMin !== undefined || 
               filters.scoreMax !== undefined
    }, [filters])

    const handleClearFilters = () => {
        setFilters({})
        setPage(1)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setPage(1)
    }

    const totalPages = data?.pagination?.totalCount && pageSize
        ? Math.ceil(data.pagination.totalCount / pageSize)
        : (data?.pagination?.hasMore ? (data.pagination.page + 1) : (data?.pagination?.page || 1))

    return (
        <div className="space-y-4">
            {filterOptions?.data && (
                <FilterBar hasActiveFilters={hasActiveFilters} onClear={handleClearFilters}>
                    <ProspectStatusFilter
                        statuses={filterOptions.data.prospectStatuses}
                        value={filters.status}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, status: value }))
                            setPage(1)
                        }}
                    />
                    <ProspectSourceFilter
                        sources={filterOptions.data.prospectSources}
                        value={filters.source}
                        onChange={(value) => {
                            setFilters(prev => ({ ...prev, source: value }))
                            setPage(1)
                        }}
                    />
                    <ProspectScoreFilter
                        min={filterOptions.data.prospectScoreRange.min}
                        max={filterOptions.data.prospectScoreRange.max}
                        minValue={filters.scoreMin}
                        maxValue={filters.scoreMax}
                        onMinChange={(value) => {
                            setFilters(prev => ({ ...prev, scoreMin: value }))
                        }}
                        onMaxChange={(value) => {
                            setFilters(prev => ({ ...prev, scoreMax: value }))
                        }}
                    />
                </FilterBar>
            )}
            <DataTable
                title="Prospects"
                data={data?.data || []}
                columns={prospectsColumns}
                isLoading={isLoading || isFetching}
                pagination={data?.pagination}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                showPagination={true}
                currentPage={data?.pagination?.page || 1}
                totalPages={totalPages}
                totalRows={data?.pagination?.totalCount || data?.data?.length || 0}
                pageSize={pageSize}
                sorting={sorting}
                setSorting={setSorting}
                showColumnVisibility={true}
                paginationOptions={{
                    pageSizeOptions: [10, 20, 30, 40]
                }}
            />
        </div>
    )
}
