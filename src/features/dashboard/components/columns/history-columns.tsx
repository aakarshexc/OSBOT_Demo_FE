import type { ColumnDef } from "@tanstack/react-table";
import type { HistoryItem } from "@/lib/analytics-api";
import { Badge } from "@/components/ui/badge";
import { ErrorMessageModal } from "./error-message-modal";

export const historyColumns: ColumnDef<HistoryItem>[] = [
    {
        accessorKey: "objectName",
        header: "Object Name",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("objectName")}</div>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant="outline"
                    className={`
            capitalize font-medium border-0
            ${status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' : ''}
            ${status === 'failed' ? 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400' : ''}
            ${status === 'running' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' : ''}
          `}
                >
                    {status}
                </Badge>
            );
        },
        enableSorting: true,
    },
    {
        accessorKey: "recordsProcessed",
        header: "Records Processed",
        cell: ({ row }) => (
            <div className="text-right font-mono">
                {row.getValue<number>("recordsProcessed").toLocaleString()}
            </div>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "durationSeconds",
        header: "Duration",
        cell: ({ row }) => {
            const duration = row.getValue("durationSeconds");
            return (
                <div className="text-right font-mono">
                    {duration ? `${parseFloat(duration as string).toFixed(2)}s` : '-'}
                </div>
            );
        },
        enableSorting: true,
    },
    {
        id: "errorMessage",
        accessorKey: "errorMessage",
        header: "Message",
        cell: ({ row }) => {
            const errorMessage = row.original.errorMessage;
            if (!errorMessage) {
                return <div className="text-muted-foreground">-</div>;
            }
            return <ErrorMessageModal errorMessage={errorMessage} />;
        },
        enableSorting: false,
    }
];
