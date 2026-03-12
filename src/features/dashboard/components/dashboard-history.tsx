import { useState } from 'react'
import { useHistory } from '../hooks/use-analytics'
import { DataTable } from './data-table'
import { historyColumns } from './columns/history-columns'
import { SortingState } from '@tanstack/react-table'

interface DashboardHistoryProps {
    startDate: string
    endDate: string
}

export function DashboardHistory({ startDate, endDate }: DashboardHistoryProps) {
    const [page, setPage] = useState(1)
    const [sorting, setSorting] = useState<SortingState>([])

    const { data, isLoading, isFetching } = useHistory(startDate, endDate, page, 100)

    // Calculate totalPages based on hasMore
    const totalPages = data?.pagination?.hasMore
        ? (data.pagination.page + 1)
        : (data?.pagination?.page || 1)

    return (
        <DataTable
            title="Activity History"
            data={data?.data || []}
            columns={historyColumns}
            isLoading={isLoading || isFetching}
            pagination={data?.pagination}
            onPageChange={setPage}
            showPagination={true}
            currentPage={data?.pagination?.page || 1}
            totalPages={totalPages}
            totalRows={data?.data?.length || 0}
            pageSize={data?.pagination?.limit || 100}
            paginationOptions={{
                pageSizeOptions: [10, 20, 50, 100]
            }}
            sorting={sorting}
            setSorting={setSorting}
            showColumnVisibility={true}
        />
    )
}
