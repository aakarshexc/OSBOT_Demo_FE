import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  selectedRows?: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showRowsInfo?: boolean;
  showFirstLastButtons?: boolean;
  canGoNext?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40],
  showPageSizeSelector = true,
  showRowsInfo = true,
  showFirstLastButtons = true,
  canGoNext = true,
}: PaginationProps) {
  const start = isLoading
    ? 0
    : Math.min((currentPage - 1) * pageSize + 1, totalRows);
  const end = isLoading ? 0 : Math.min(currentPage * pageSize, totalRows);

  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    if (onPageSizeChange && !isNaN(newPageSize)) {
      onPageSizeChange(newPageSize);
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="flex sm:hidden flex-col space-y-3 py-4 px-4 text-sm text-muted-foreground font-light">
        {/* Mobile: Page Size Selector and Row Info in one row */}
        <div className="flex items-center justify-between">
          {showPageSizeSelector && (
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-xs">Rows:</span>
              <Select
                value={String(pageSize)}
                disabled={isLoading}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-16 rounded-full px-3 py-2 cursor-pointer text-xs">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={String(option)}
                      className="cursor-pointer"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {showRowsInfo && (
            <div className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${start}-${end} of ${totalRows}`}
            </div>
          )}
        </div>

        {/* Mobile: Navigation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {showFirstLastButtons && (
              <Button
                variant="outline"
                className="h-9 w-9 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                onClick={(e) => handlePageChange(1, e)}
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              className="h-9 w-9 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
              onClick={(e) => handlePageChange(currentPage - 1, e)}
              disabled={currentPage <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-foreground text-sm font-medium">
            {currentPage} / {totalPages || 1}
          </span>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="h-9 w-9 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
              onClick={(e) => handlePageChange(currentPage + 1, e)}
              disabled={!canGoNext || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {showFirstLastButtons && (
              <Button
                variant="outline"
                className="h-9 w-9 p-2 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                onClick={(e) => handlePageChange(totalPages, e)}
                disabled={!canGoNext || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between space-x-2 py-4 text-sm text-muted-foreground font-light">
        {showRowsInfo && (
          <div className="flex-1">
            <span>
              {isLoading
                ? "Loading..."
                : `Showing ${start}-${end} rows out of ${totalRows}.`}
            </span>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {showPageSizeSelector && (
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <Select
                value={String(pageSize)}
                disabled={isLoading}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-20 rounded-full px-4 py-6 cursor-pointer">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={String(option)}
                      className="cursor-pointer"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center">
            <span className="mr-4 text-foreground">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex items-center space-x-1">
              {showFirstLastButtons && (
                <Button
                  variant="outline"
                  className="h-10 w-10 p-2 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                  onClick={(e) => handlePageChange(1, e)}
                  disabled={currentPage <= 1 || isLoading}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                className="h-10 w-10 p-2 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                onClick={(e) => handlePageChange(currentPage - 1, e)}
                disabled={currentPage <= 1 || isLoading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-10 w-10 p-2 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                onClick={(e) => handlePageChange(currentPage + 1, e)}
                disabled={!canGoNext || isLoading}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              {showFirstLastButtons && (
                <Button
                  variant="outline"
                  className="h-10 w-10 p-2 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                  onClick={(e) => handlePageChange(totalPages, e)}
                  disabled={!canGoNext || isLoading}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

