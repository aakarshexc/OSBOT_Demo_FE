import React, {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type Header,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "./pagination";

export interface CustomTableState {
  rowHoveredId: string | null;
  cellHoveredId: string | null;
}

interface DataTableProps<TData, TValue> {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  totalRows?: number;
  currentPage?: number;
  isSorting?: boolean;
  totalPages?: number;
  showPagination?: boolean;
  paginationOptions?: {
    showPageSizeSelector?: boolean;
    showRowsInfo?: boolean;
    showFirstLastButtons?: boolean;
    pageSizeOptions?: number[];
  };
  isError?: boolean;
  onRowClick?: (row: TData) => void;
  pageSize?: number;
  sorting?: SortingState;
  setSorting?: React.Dispatch<SetStateAction<SortingState>>;
  showColumnVisibility?: boolean;
  defaultVisibleColumns?: Record<string, boolean>;
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
    totalCount?: number;
  };
}

export function DataTable<TData, TValue>({
  title,
  data,
  columns,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  totalRows = 10,
  currentPage = 1,
  totalPages = 1,
  showPagination = false,
  paginationOptions = {},
  pageSize: propPageSize,
  isError = false,
  sorting,
  setSorting,
  showColumnVisibility = true,
  defaultVisibleColumns,
  pagination: paginationData,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    defaultVisibleColumns || {}
  );
  const [rowHoveredId, setRowHoveredId] = useState<string | null>(null);
  const [cellHoveredId, setCellHoveredId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(propPageSize || paginationData?.limit || 10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const prevPageSizeRef = useRef(propPageSize);

  const parsedCurrentPage = useMemo(
    () =>
      typeof currentPage === "string" ? parseInt(currentPage, 10) : currentPage,
    [currentPage]
  );

  const displayTotal = useMemo(() => {
    if (totalRows && totalRows > 0) return totalRows;
    // If we have pagination data and hasMore, estimate total
    if (paginationData?.hasMore) {
      return (parsedCurrentPage + 1) * pageSize;
    }
    return data.length;
  }, [totalRows, data.length, paginationData, parsedCurrentPage, pageSize]);

  // Calculate totalPages based on totalCount or hasMore
  const calculatedTotalPages = useMemo(() => {
    if (paginationData?.totalCount !== undefined && pageSize) {
      return Math.ceil(paginationData.totalCount / pageSize);
    }
    if (totalPages && totalPages > parsedCurrentPage) return totalPages;
    if (paginationData?.hasMore) {
      return parsedCurrentPage + 1; // At least one more page
    }
    return parsedCurrentPage; // Current page is the last
  }, [totalPages, paginationData, parsedCurrentPage, pageSize]);

  // Check if we can go to next page
  const canGoNext = useMemo(() => {
    if (paginationData?.totalCount !== undefined && pageSize) {
      return parsedCurrentPage < calculatedTotalPages;
    }
    if (paginationData?.hasMore) return true;
    return parsedCurrentPage < calculatedTotalPages;
  }, [paginationData?.hasMore, paginationData?.totalCount, parsedCurrentPage, calculatedTotalPages, pageSize]);

  useEffect(() => {
    if (propPageSize && propPageSize !== prevPageSizeRef.current) {
      setPageSize(propPageSize);
      prevPageSizeRef.current = propPageSize;
    } else if (paginationData?.limit && paginationData.limit !== pageSize) {
      setPageSize(paginationData.limit);
    }
  }, [propPageSize, paginationData?.limit, pageSize]);

  const tableData = useMemo(() => {
    return data;
  }, [data]);

  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      if (setSorting) {
        setSorting((oldSorting) => {
          const newSorting =
            typeof updater === "function" ? updater(oldSorting) : updater;

          if (
            oldSorting.length === 0 ||
            (newSorting.length > 0 && oldSorting[0].id !== newSorting[0].id)
          ) {
            return [{ id: newSorting[0].id, desc: false }];
          }

          return [{ id: oldSorting[0].id, desc: !oldSorting[0].desc }];
        });
      }
    },
    [setSorting]
  );

  const handleRowMouseEnter = useCallback((rowId: string) => {
    setRowHoveredId(rowId);
  }, []);

  const handleRowMouseLeave = useCallback(() => {
    setRowHoveredId(null);
  }, []);

  const handleCellMouseEnter = useCallback((cellId: string) => {
    setCellHoveredId(cellId);
  }, []);

  const handleCellMouseLeave = useCallback(() => {
    setCellHoveredId(null);
  }, []);

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    },
    [onPageSizeChange]
  );

  const handleSortClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>, header: Header<TData, unknown>) => {
      const toggleHandler = header.column.getToggleSortingHandler();
      if (toggleHandler) {
        toggleHandler(e);
      }
    },
    []
  );

  // Memoize table configuration
  const tableConfig = useMemo(
    () => ({
      data: tableData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: handleSortingChange,
      onColumnVisibilityChange: setColumnVisibility,
      ...(showPagination && { getPaginationRowModel: getPaginationRowModel() }),
      manualPagination: showPagination,
      state: {
        columnVisibility,
        sorting: sorting || [],
        ...(showPagination && {
          pagination: {
            pageIndex: parsedCurrentPage - 1,
            pageSize,
          },
        }),
        rowSelection,
        rowHoveredId,
        cellHoveredId,
      } as CustomTableState & {
        sorting: SortingState;
        pagination?: { pageIndex: number; pageSize: number };
        rowSelection: RowSelectionState;
      },
      onRowSelectionChange: setRowSelection,
      enableRowSelection: true,
      ...(showPagination && {
        pageCount: calculatedTotalPages || Math.ceil(displayTotal / pageSize),
        initialState: {
          pagination: {
            pageSize,
          },
        },
      }),
    }),
    [
      tableData,
      columns,
      handleSortingChange,
      showPagination,
      columnVisibility,
      sorting,
      parsedCurrentPage,
      pageSize,
      rowSelection,
      rowHoveredId,
      cellHoveredId,
      calculatedTotalPages,
      displayTotal,
    ]
  );

  const table = useReactTable(tableConfig);

  if (isLoading) {
    return (
      <div className="bg-muted/40 text-foreground rounded-xl">
        <Skeleton className="h-[300px] sm:h-[500px] w-full rounded-2xl sm:rounded-3xl border border-border" />
      </div>
    );
  }

  if (isError || (data.length === 0 && !isLoading)) {
    return (
      <div className="bg-muted/40 text-foreground rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 text-foreground rounded-2xl sm:rounded-3xl">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full p-4 sm:pt-6 sm:pr-6 sm:pl-6 gap-3">
        {title && (
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-heading font-semibold">
              {title}
            </h1>
            {paginationData?.totalCount !== undefined && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 dark:bg-muted/40 border border-border/50 text-sm font-medium transition-colors hover:bg-muted/80">
                <span className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Records</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                <span className="font-semibold text-foreground tabular-nums">{paginationData.totalCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {/* Column Visibility */}
          {showColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="min-w-full bg-card rounded-xl overflow-hidden border border-border">
            <Table className="border-collapse">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="h-10 sm:h-12 bg-muted border-none"
                  >
                    {headerGroup.headers.map((header, headerIndex) => {
                      const shouldShowSortIcon =
                        header.column.getCanSort() &&
                        header.column.columnDef.enableSorting !== false &&
                        !header.isPlaceholder &&
                        header.column.columnDef.header;

                      const sortDirection = header.column.getIsSorted();
                      const isAscending = sortDirection === "asc";
                      const isDescending = sortDirection === "desc";

                      const isLastHeader = headerIndex === headerGroup.headers.length - 1;

                      return (
                        <TableHead
                          key={header.id}
                          className={`font-medium text-xs sm:text-sm text-muted-foreground px-4 py-3 border-b border-border ${
                            !isLastHeader ? "border-r border-border/50" : ""
                          }`}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </span>
                              {shouldShowSortIcon && (
                                <div className="flex flex-col cursor-pointer">
                                  <ChevronUp
                                    onClick={(e) => handleSortClick(e, header)}
                                    className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 -mb-1 transition-colors ${
                                      isAscending
                                        ? "text-primary"
                                        : "text-muted-foreground/40"
                                    }`}
                                  />
                                  <ChevronDown
                                    onClick={(e) => handleSortClick(e, header)}
                                    className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 -mt-1 transition-colors ${
                                      isDescending
                                        ? "text-primary"
                                        : "text-muted-foreground/40"
                                    }`}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row, index) => {
                  const isFirstRow = index === 0;
                  const isLastRow =
                    index === table.getRowModel().rows.length - 1;
                  const isSingleRow = table.getRowModel().rows.length === 1;

                  let roundedClasses = "";

                  if (isSingleRow) {
                    roundedClasses =
                      "rounded-2xl sm:rounded-3xl [&>td:first-child]:rounded-l-2xl sm:[&>td:first-child]:rounded-l-3xl [&>td:last-child]:rounded-r-2xl sm:[&>td:last-child]:rounded-r-3xl";
                  } else if (isFirstRow) {
                    roundedClasses =
                      "rounded-t-2xl sm:rounded-t-3xl [&>td:first-child]:rounded-tl-2xl sm:[&>td:first-child]:rounded-tl-3xl [&>td:last-child]:rounded-tr-2xl sm:[&>td:last-child]:rounded-tr-3xl";
                  } else if (isLastRow) {
                    roundedClasses =
                      "rounded-b-2xl sm:rounded-b-3xl [&>td:first-child]:rounded-bl-2xl sm:[&>td:first-child]:rounded-bl-3xl [&>td:last-child]:rounded-br-2xl sm:[&>td:last-child]:rounded-br-3xl";
                  }

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onMouseEnter={() =>
                        handleRowMouseEnter(row.index.toString())
                      }
                      onMouseLeave={handleRowMouseLeave}
                      className={`text-xs sm:text-sm font-normal bg-card text-foreground hover:bg-primary/15 hover:text-primary h-12 sm:h-14 transition-colors group ${roundedClasses}`}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const isLastCell = cellIndex === row.getVisibleCells().length - 1;
                        return (
                          <TableCell
                            onMouseEnter={() => handleCellMouseEnter(cell.id)}
                            onMouseLeave={handleCellMouseLeave}
                            className={`px-4 py-3 border-b border-border/30 bg-transparent group-hover:bg-transparent group-hover:text-inherit ${
                              !isLastCell ? "border-r border-border/50" : ""
                            }`}
                            key={cell.id}
                          >
                            <div className="truncate group-hover:text-inherit">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {showPagination && (
          <Pagination
            currentPage={parsedCurrentPage}
            totalPages={calculatedTotalPages}
            pageSize={pageSize}
            totalRows={paginationData?.totalCount ?? displayTotal}
            pageSizeOptions={paginationOptions.pageSizeOptions ?? [10, 20, 30, 40]}
            isLoading={isLoading}
            onPageChange={onPageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={paginationOptions.showPageSizeSelector ?? true}
            showRowsInfo={paginationOptions.showRowsInfo ?? true}
            showFirstLastButtons={paginationOptions.showFirstLastButtons ?? true}
            canGoNext={canGoNext}
          />
        )}
      </div>
    </div>
  );
}
