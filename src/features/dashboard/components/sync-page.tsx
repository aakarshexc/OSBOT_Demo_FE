import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, Loader2, RefreshCw } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthStore } from '@/stores/auth-store'
import { salesforceApi } from '@/lib/salesforce-api'
import { toast } from 'sonner'
import { type SalesforceSyncResponse } from '@/lib/salesforce-api'

type SyncTarget =
  | { type: 'ALL'; label: string }
  | { type: 'ENTITY'; apiName: string; label: string }

const PREVIEW_PAGE_SIZE = 50

const formatNumber = (value?: number) =>
  typeof value === 'number' ? value.toLocaleString() : '-'

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString() : '-'

const formatDuration = (value?: number) =>
  typeof value === 'number' ? `${value.toFixed(2)}s` : '-'

const formatElapsed = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const renderRecordValue = (value: unknown) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const sumFromResults = (
  results: SalesforceSyncResponse['results'],
  key:
    | 'recordsFound'
    | 'recordsProcessed'
    | 'recordsArchived'
    | 'recordsErrored'
    | 'recordsExisting'
    | 'recordsNew'
) => {
  return (results || []).reduce((acc, result) => {
    const value = result[key]
    return acc + (typeof value === 'number' ? value : 0)
  }, 0)
}

export function SyncPage() {
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [rowSyncingApiName, setRowSyncingApiName] = useState<string | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<SyncTarget | null>(null)
  const [previewResult, setPreviewResult] = useState<SalesforceSyncResponse | null>(null)
  const [recordPage, setRecordPage] = useState(1)
  const [activeJob, setActiveJob] = useState<{
    kind: 'preview' | 'sync'
    label: string
    startedAt: number
  } | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!activeJob) {
      setElapsedSeconds(0)
      return
    }

    const tick = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - activeJob.startedAt) / 1000)))
    }

    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [activeJob])

  const handlePreview = async (target: SyncTarget) => {
    setSelectedTarget(target)
    setPreviewResult(null)
    setRecordPage(1)
    const loadingToast = toast.loading(`Previewing ${target.label}...`)
    setIsPreviewing(true)
    setActiveJob({ kind: 'preview', label: target.label, startedAt: Date.now() })
    try {
      const response =
        target.type === 'ALL'
          ? await salesforceApi.previewAll()
          : await salesforceApi.previewEntity(target.apiName)

      setPreviewResult(response)
      const hasRows = (response.results?.length || 0) > 0 || (response.records?.length || 0) > 0
      if (response.success || hasRows) {
        toast.success(response.message || `Preview ready for ${target.label}`)
      } else {
        toast.error(response.message || `Preview failed for ${target.label}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to preview Salesforce data'
      toast.error(message)
    } finally {
      toast.dismiss(loadingToast)
      setIsPreviewing(false)
      setActiveJob(null)
      setIsOpen(false)
    }
  }

  const handleSyncSelection = async (target: SyncTarget) => {
    const loadingToast = toast.loading(`Syncing ${target.label}...`)
    setIsSyncing(true)
    setActiveJob({ kind: 'sync', label: target.label, startedAt: Date.now() })
    try {
      const response =
        target.type === 'ALL'
          ? await salesforceApi.syncAll()
          : await salesforceApi.syncEntity(target.apiName)

      if (!response.success) {
        throw new Error(response.message || `Failed to sync ${target.label}`)
      }

      toast.success(response.message || `${target.label} synced successfully`)
      void queryClient.invalidateQueries()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sync Salesforce data'
      toast.error(message)
    } finally {
      toast.dismiss(loadingToast)
      setIsSyncing(false)
      setActiveJob(null)
    }
  }

  const handleSyncSingleObject = async (apiName: string, label: string) => {
    const loadingToast = toast.loading(`Syncing ${label}...`)
    setRowSyncingApiName(apiName)
    setActiveJob({ kind: 'sync', label, startedAt: Date.now() })
    try {
      const response = await salesforceApi.syncEntity(apiName)
      if (!response.success) {
        throw new Error(response.message || `Failed to sync ${label}`)
      }
      toast.success(response.message || `${label} synced successfully`)
      void queryClient.invalidateQueries()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sync Salesforce data'
      toast.error(message)
    } finally {
      toast.dismiss(loadingToast)
      setRowSyncingApiName(null)
      setActiveJob(null)
    }
  }

  const syncOptions = [
    {
      apiName: 'nu_law__Matter__c',
      label: 'Matter',
    },
    {
      apiName: 'Nu_OM__Treatment__c',
      label: 'Treatment',
    },
    {
      apiName: 'nu_law__Prospect__c',
      label: 'Prospect',
    },
    {
      apiName: 'Nu_OM__Settlement__c',
      label: 'Settlement',
    },
    {
      apiName: 'Nu_OM__Demand__c',
      label: 'Demand',
    },
    {
      apiName: 'nu_law__Transaction__c',
      label: 'Transaction',
    },
  ]

  const allResults = previewResult?.results || []
  const previewRecords = previewResult?.records || []
  const isAllPreview = selectedTarget?.type === 'ALL'
  const isEntityPreview = selectedTarget?.type === 'ENTITY'

  const summaryStats = useMemo(() => {
    const archivedFromResults = sumFromResults(allResults, 'recordsArchived')
    const existingFromResults = sumFromResults(allResults, 'recordsExisting')
    const archivedFallbackFromResults =
      archivedFromResults > 0 ? archivedFromResults : existingFromResults

    const found =
      previewResult?.totalRecordsFound ??
      previewResult?.recordsFound ??
      sumFromResults(allResults, 'recordsFound')

    const processed =
      previewResult?.totalRecordsProcessed ??
      previewResult?.recordsProcessed ??
      sumFromResults(allResults, 'recordsProcessed')

    const archived =
      previewResult?.totalRecordsArchived ??
      previewResult?.recordsArchived ??
      previewResult?.totalRecordsExisting ??
      previewResult?.recordsExisting ??
      archivedFallbackFromResults

    const errored =
      previewResult?.totalRecordsErrored ??
      previewResult?.recordsErrored ??
      sumFromResults(allResults, 'recordsErrored')

    const successfulObjects =
      previewResult?.successfulObjects ??
      allResults.filter((result) => result.status === 'success').length

    const partialObjects =
      previewResult?.partialObjects ??
      allResults.filter((result) => result.status === 'partial').length

    const failedObjects =
      previewResult?.failedObjects ??
      allResults.filter((result) => result.status === 'failed').length

    const totalObjects = previewResult?.totalObjects ?? allResults.length

    return {
      found,
      processed,
      archived,
      errored,
      successfulObjects,
      partialObjects,
      failedObjects,
      totalObjects,
    }
  }, [allResults, previewResult])

  const totalRecordPages = Math.max(1, Math.ceil(previewRecords.length / PREVIEW_PAGE_SIZE))
  const paginatedRecords = useMemo(() => {
    const start = (recordPage - 1) * PREVIEW_PAGE_SIZE
    return previewRecords.slice(start, start + PREVIEW_PAGE_SIZE)
  }, [previewRecords, recordPage])

  const previewRecordColumns = useMemo(() => {
    const first = previewRecords[0]
    if (!first) return []
    return Object.keys(first).slice(0, 8)
  }, [previewRecords])

  const hasPreviewData = Boolean(
    previewResult &&
      ((previewResult.results?.length || 0) > 0 ||
        (previewResult.records?.length || 0) > 0 ||
        typeof summaryStats.found === 'number' ||
        typeof summaryStats.processed === 'number' ||
        typeof summaryStats.archived === 'number' ||
        typeof summaryStats.errored === 'number')
  )

  return (
    <Main>
      <div className='mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-6'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-heading font-bold tracking-tight text-foreground'>
              Sync
            </h1>
            <p className='text-sm text-muted-foreground'>
              Preview Salesforce changes first, then sync only what you approve.
            </p>
          </div>

          {user?.role === 'CLIENT_ADMIN' ? (
            <div className='flex flex-wrap items-center gap-2'>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={isPreviewing || isSyncing || !!rowSyncingApiName}
                    className='h-9 w-fit rounded-full px-4 gap-2 border-muted-foreground/20 shadow-sm hover:shadow hover:border-primary/30'
                  >
                    <Eye className='h-4 w-4' />
                    <span>{isPreviewing ? 'Previewing...' : 'Preview Salesforce Data'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      void handlePreview({ type: 'ALL', label: 'All Objects' })
                    }}
                  >
                    Preview All
                  </DropdownMenuItem>
                  {syncOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.apiName}
                      onSelect={(event) => {
                        event.preventDefault()
                        void handlePreview({
                          type: 'ENTITY',
                          apiName: option.apiName,
                          label: option.label,
                        })
                      }}
                    >
                      {`Preview ${option.label}`}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedTarget && hasPreviewData && (
                <Button
                  size='sm'
                  disabled={isPreviewing || isSyncing || !!rowSyncingApiName}
                  onClick={() => void handleSyncSelection(selectedTarget)}
                  className='h-9 rounded-full px-4 gap-2'
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : `Sync ${selectedTarget.label}`}</span>
                </Button>
              )}

              {previewResult && (
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={isPreviewing || isSyncing || !!rowSyncingApiName}
                  onClick={() => {
                    setPreviewResult(null)
                    setSelectedTarget(null)
                    setRecordPage(1)
                  }}
                >
                  Clear Preview
                </Button>
              )}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>
              You do not have access to Salesforce sync options.
            </p>
          )}

          {activeJob && (
            <Card className='border-primary/30 bg-primary/5'>
              <CardHeader className='pb-2'>
                <div className='flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin text-primary' />
                  <CardTitle className='text-base'>
                    {activeJob.kind === 'preview' ? 'Preview in progress' : 'Sync in progress'}
                  </CardTitle>
                </div>
                <CardDescription>
                  {activeJob.kind === 'preview'
                    ? `Previewing ${activeJob.label}. This can take up to 5 minutes for large objects.`
                    : `Syncing ${activeJob.label}. Keep this page open until it completes.`}
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-0'>
                <p className='text-sm font-medium'>Elapsed time: {formatElapsed(elapsedSeconds)}</p>
              </CardContent>
            </Card>
          )}

          {!previewResult ? (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Start with a preview</CardTitle>
                <CardDescription>
                  Choose Preview All or a single object from the dropdown. We will show summary
                  counts and detailed rows so you can sync with confidence.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-2 text-sm text-muted-foreground'>
                <p>- Preview first: no database changes are made.</p>
                <p>- Then click sync for all objects or one specific object.</p>
                <p>- Large record sets are paginated for fast rendering.</p>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Records Found</CardDescription>
                    <CardTitle className='text-2xl'>
                      {formatNumber(summaryStats.found)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Records Processed</CardDescription>
                    <CardTitle className='text-2xl'>
                      {formatNumber(summaryStats.processed)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Records Archived</CardDescription>
                    <CardTitle className='text-2xl'>
                      {formatNumber(summaryStats.archived)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Records Errored</CardDescription>
                    <CardTitle className='text-2xl'>{formatNumber(summaryStats.errored)}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Total Objects</CardDescription>
                    <CardTitle className='text-2xl'>{formatNumber(summaryStats.totalObjects)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Successful Objects</CardDescription>
                    <CardTitle className='text-2xl'>
                      {formatNumber(summaryStats.successfulObjects)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Partial Objects</CardDescription>
                    <CardTitle className='text-2xl'>{formatNumber(summaryStats.partialObjects)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardDescription>Duration</CardDescription>
                    <CardTitle className='text-2xl'>{formatDuration(previewResult.durationSeconds)}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader className='pb-3'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <CardTitle className='text-base'>Preview Result</CardTitle>
                    <Badge
                      variant={
                        previewResult.success
                          ? 'default'
                          : summaryStats.partialObjects > 0
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {previewResult.success
                        ? 'Success'
                        : summaryStats.partialObjects > 0
                          ? 'Partial'
                          : 'Failed'}
                    </Badge>
                    <Badge variant='outline'>
                      {previewResult.preview ? 'Preview Mode' : 'Sync Mode'}
                    </Badge>
                    {selectedTarget && <Badge variant='secondary'>{selectedTarget.label}</Badge>}
                  </div>
                  {previewResult.message && (
                    <CardDescription>{previewResult.message}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className='space-y-4'>
                  {isAllPreview && allResults.length > 0 && (
                    <div className='rounded-lg border'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Object</TableHead>
                            <TableHead>API Name</TableHead>
                            <TableHead>Found</TableHead>
                            <TableHead>Processed</TableHead>
                            <TableHead>Archived</TableHead>
                            <TableHead>Errored</TableHead>
                            <TableHead>Last Modstamp</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allResults.map((result) => {
                            const rowLabel = result.object || result.apiName || 'Object'
                            const apiName = result.apiName || ''
                            return (
                              <TableRow key={apiName || rowLabel}>
                                <TableCell>{rowLabel}</TableCell>
                                <TableCell className='font-mono text-xs'>{apiName || '-'}</TableCell>
                                <TableCell>{formatNumber(result.recordsFound)}</TableCell>
                                <TableCell>{formatNumber(result.recordsProcessed)}</TableCell>
                                <TableCell>{formatNumber(result.recordsArchived ?? result.recordsExisting)}</TableCell>
                                <TableCell>{formatNumber(result.recordsErrored)}</TableCell>
                                <TableCell>{formatDate(result.lastSystemModstamp)}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      result.status === 'success'
                                        ? 'default'
                                        : result.status === 'partial'
                                          ? 'secondary'
                                          : 'destructive'
                                    }
                                  >
                                    {result.status || 'unknown'}
                                  </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    disabled={!apiName || rowSyncingApiName === apiName}
                                    onClick={() => void handleSyncSingleObject(apiName, rowLabel)}
                                  >
                                    {rowSyncingApiName === apiName ? 'Syncing...' : 'Sync This'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {isEntityPreview && (
                    <div className='rounded-lg border p-4'>
                      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm'>
                        <div>
                          <p className='text-muted-foreground'>Object</p>
                          <p className='font-medium'>{previewResult.object || '-'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>API Name</p>
                          <p className='font-mono text-xs'>{previewResult.apiName || '-'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Records Found</p>
                          <p className='font-medium'>{formatNumber(previewResult.recordsFound)}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Records Processed</p>
                          <p className='font-medium'>{formatNumber(previewResult.recordsProcessed)}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Records Archived</p>
                          <p className='font-medium'>{formatNumber(previewResult.recordsArchived ?? previewResult.recordsExisting)}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Records Errored</p>
                          <p className='font-medium'>{formatNumber(previewResult.recordsErrored)}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Last Modstamp</p>
                          <p className='font-medium'>{formatDate(previewResult.lastSystemModstamp)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewRecords.length > 0 && (
                    <div className='space-y-3 rounded-lg border p-3'>
                      <div className='flex flex-wrap items-center justify-between gap-2'>
                        <p className='text-sm font-medium'>
                          Records ({formatNumber(previewRecords.length)} total)
                        </p>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            disabled={recordPage <= 1}
                            onClick={() => setRecordPage((prev) => Math.max(1, prev - 1))}
                          >
                            Previous
                          </Button>
                          <span className='text-xs text-muted-foreground'>
                            Page {recordPage} of {totalRecordPages}
                          </span>
                          <Button
                            variant='outline'
                            size='sm'
                            disabled={recordPage >= totalRecordPages}
                            onClick={() =>
                              setRecordPage((prev) => Math.min(totalRecordPages, prev + 1))
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            {previewRecordColumns.map((column) => (
                              <TableHead key={column} className='font-mono text-xs'>
                                {column}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedRecords.map((record, index) => (
                            <TableRow key={`${recordPage}-${index}`}>
                              {previewRecordColumns.map((column) => (
                                <TableCell key={column} className='max-w-[260px] truncate'>
                                  {renderRecordValue(record[column])}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Main>
  )
}

