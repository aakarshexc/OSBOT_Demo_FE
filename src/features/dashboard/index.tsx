import { useState, useCallback, useEffect } from 'react'
import { Main } from '@/components/layout/main'
import { DateRangePicker } from './components/date-range-picker'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { DashboardOverview } from './components/dashboard-overview'
import { DashboardHistory } from './components/dashboard-history'
import { DashboardBranding } from './components/dashboard-branding'
import { PageBranding } from './components/page-branding'
import { useAuthStore } from '@/stores/auth-store'
import { useDashboardStore } from '@/stores/dashboard-store'
import {
  ActiveCasesTable,
  ReportsTable,
  SettlementCasesTable,
  LitigationCasesTable,
  ProspectsTable
} from './components/analytics-tables'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'


// function removed

export function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const activeTab = useDashboardStore((state) => state.activeTab)
  const setActiveTab = useDashboardStore((state) => state.setActiveTab)
  const queryClient = useQueryClient()
  // Use Date objects for state to match DateRangePicker
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2023-01-01'))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date('2026-01-01'))

  useEffect(() => {
    return () => {
      setActiveTab('overview')
    }
  }, [setActiveTab])

  const handleStartDateChange = useCallback((date: Date | undefined) => {
    setStartDate(date)
  }, [])

  const handleEndDateChange = useCallback((date: Date | undefined) => {
    setEndDate(date)
  }, [])

  // Helper to format date for API/Components
  // Uses local timezone to avoid date shifting issues
  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  const STALE_MS = 5 * 60 * 1000

  const getTabQueryKeyPrefix = useCallback(
    (
      tab: 'overview' | 'active-cases' | 'reports' | 'settlement' | 'litigation' | 'prospects' | 'history'
    ) => {
      switch (tab) {
        case 'overview':
          return ['summary', formattedStart, formattedEnd] as const
        case 'active-cases':
          return ['activeCases', formattedStart, formattedEnd] as const
        case 'reports':
          return ['pipelineValue', formattedStart, formattedEnd] as const
        case 'settlement':
          return ['settlementCases', formattedStart, formattedEnd] as const
        case 'litigation':
          return ['litigationCases', formattedStart, formattedEnd] as const
        case 'prospects':
          return ['prospects', formattedStart, formattedEnd] as const
        case 'history':
          return ['history', formattedStart, formattedEnd] as const
        default:
          return ['summary', formattedStart, formattedEnd] as const
      }
    },
    [formattedEnd, formattedStart]
  )

  const refreshOverview = useCallback(() => {
    // Refresh both summary and dummyResponse queries
    void queryClient.refetchQueries({
      queryKey: ['summary', formattedStart, formattedEnd],
      exact: false,
      type: 'all',
    })
    // void queryClient.refetchQueries({
    //   queryKey: ['dummyResponse'],
    //   exact: false,
    //   type: 'all',
    // })
  }, [formattedStart, formattedEnd, queryClient])

  const refreshActiveTab = useCallback(() => {
    if (activeTab === 'overview') {
      refreshOverview()
      return
    }
    const queryKey = getTabQueryKeyPrefix(activeTab)
    void queryClient.refetchQueries({
      queryKey,
      exact: false,
      // "all" ensures we still refetch even if the tab content isn't considered "active" by React Query
      type: 'all',
    })
  }, [activeTab, getTabQueryKeyPrefix, queryClient, refreshOverview])

  const maybeAutoRefreshTab = useCallback(
    (
      tab: 'overview' | 'active-cases' | 'reports' | 'settlement' | 'litigation' | 'prospects' | 'history'
    ) => {
      const queryKey = getTabQueryKeyPrefix(tab)
      const queries = queryClient.getQueryCache().findAll({ queryKey, exact: false })
      if (queries.length === 0) return

      const latestUpdatedAt = Math.max(...queries.map((q) => q.state.dataUpdatedAt || 0))
      if (latestUpdatedAt > 0 && Date.now() - latestUpdatedAt >= STALE_MS) {
        void queryClient.refetchQueries({ queryKey, exact: false, type: 'all' })
      }
    },
    [getTabQueryKeyPrefix, queryClient]
  )

  const handleTabChange = useCallback(
    (value: string) => {
      const tab = value as typeof activeTab
      setActiveTab(tab)
    },
    [activeTab, setActiveTab]
  )

  useEffect(() => {
    maybeAutoRefreshTab(activeTab)
  }, [activeTab, maybeAutoRefreshTab])

  return (
    <Main fluid>
      <div className="mx-auto w-full max-w-[1920px] 2xl:max-w-[2400px] px-4 sm:px-6 lg:px-8">
        <DashboardBranding user={user}>
          <div className="flex flex-col items-stretch sm:items-end gap-2">
            <DateRangePicker
              dateFrom={startDate}
              dateTo={endDate}
              onDateFromChange={handleStartDateChange}
              onDateToChange={handleEndDateChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={refreshActiveTab}
              className="h-8 rounded-lg px-3 gap-1.5 border-border/60 shadow-sm hover:border-primary/30 self-end"
              title="Refresh current tab data"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Refresh</span>
            </Button>
          </div>
        </DashboardBranding>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 pb-24">

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

          <TabsContent value="active-cases" className="space-y-4">
            <PageBranding title="Active Cases" description="Track and manage your PI cases in progress" />
            <ActiveCasesTable startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <PageBranding title="Pipeline Reports" description="Financial pipeline and fee analysis for your PI firm" />
            <ReportsTable startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

          <TabsContent value="settlement" className="space-y-4">
            <PageBranding title="Settlement Cases" description="Settlement outcomes and case resolution tracking" />
            <SettlementCasesTable startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

          <TabsContent value="litigation" className="space-y-4">
            <PageBranding title="Litigation Cases" description="Litigation stage and value tracking" />
            <LitigationCasesTable startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

          <TabsContent value="prospects" className="space-y-4">
            <PageBranding title="Prospects" description="Leads and intake pipeline for your PI practice" />
            <ProspectsTable startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <PageBranding title="Activity History" description="Data sync and activity logs" />
            <DashboardHistory startDate={formattedStart} endDate={formattedEnd} />
          </TabsContent>

        </Tabs>
      </div>
    </Main>
  )
}
