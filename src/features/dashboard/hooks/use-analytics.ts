import { useQuery } from '@tanstack/react-query'
import { analyticsApi, type ActiveCasesFilters, type ReportsFilters, type SettlementCasesFilters, type LitigationCasesFilters, type ProspectsFilters } from '@/lib/analytics-api'

export const useActiveCases = (startDate: string, endDate: string, page: number, pageSize: number, filters?: ActiveCasesFilters) => {
    return useQuery({
        queryKey: ['activeCases', startDate, endDate, page, pageSize, filters],
        queryFn: () => analyticsApi.getActiveCases(startDate, endDate, page, pageSize, filters),
        placeholderData: (prev) => prev,
    })
}

export const usePipelineValue = (startDate: string, endDate: string, page: number, pageSize: number, filters?: ReportsFilters) => {
    return useQuery({
        queryKey: ['pipelineValue', startDate, endDate, page, pageSize, filters],
        queryFn: () => analyticsApi.getPipelineValue(startDate, endDate, page, pageSize, filters),
        placeholderData: (prev) => prev,
    })
}

export const useSettlementCases = (startDate: string, endDate: string, page: number, pageSize: number, filters?: SettlementCasesFilters) => {
    return useQuery({
        queryKey: ['settlementCases', startDate, endDate, page, pageSize, filters],
        queryFn: () => analyticsApi.getSettlementCases(startDate, endDate, page, pageSize, filters),
        placeholderData: (prev) => prev,
    })
}

export const useLitigationCases = (startDate: string, endDate: string, page: number, pageSize: number, filters?: LitigationCasesFilters) => {
    return useQuery({
        queryKey: ['litigationCases', startDate, endDate, page, pageSize, filters],
        queryFn: () => analyticsApi.getLitigationCases(startDate, endDate, page, pageSize, filters),
        placeholderData: (prev) => prev,
    })
}

export const useProspects = (startDate: string, endDate: string, page: number, pageSize: number, filters?: ProspectsFilters) => {
    return useQuery({
        queryKey: ['prospects', startDate, endDate, page, pageSize, filters],
        queryFn: () => analyticsApi.getProspects(startDate, endDate, page, pageSize, filters),
        placeholderData: (prev) => prev,
    })
}

export const useSummary = (startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['summary', startDate, endDate],
        queryFn: () => analyticsApi.getSummary(startDate, endDate),
    })
}

export const useHistory = (startDate: string, endDate: string, page: number, limit: number) => {
    return useQuery({
        queryKey: ['history', startDate, endDate, page, limit],
        queryFn: () => analyticsApi.getHistory(startDate, endDate, page, limit),
        placeholderData: (prev) => prev,
    })
}

export const useDummyResponse = () => {
    return useQuery({
        queryKey: ['dummyResponse'],
        queryFn: () => analyticsApi.getDummyResponse(),
    })
}

export const useFilterOptions = () => {
    return useQuery({
        queryKey: ['filterOptions'],
        queryFn: () => analyticsApi.getFilterOptions(),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })
}
