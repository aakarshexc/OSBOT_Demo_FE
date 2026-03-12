import type { ColumnDef } from "@tanstack/react-table";
import type { LitigationCase } from "@/lib/analytics-api";

const formatCurrency = (amount: string | number | null) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

export const litigationColumns: ColumnDef<LitigationCase>[] = [
  {
    id: "matter_name",
    accessorKey: "matter_name",
    header: "Matter Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("matter_name")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "client_name",
    accessorKey: "client_name",
    header: "Client",
    cell: ({ row }) => <div>{row.getValue("client_name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "litigation_stage",
    accessorKey: "litigation_stage",
    header: "Stage",
    cell: ({ row }) => <div>{row.getValue("litigation_stage")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "projected_actual_value",
    accessorKey: "projected_actual_value",
    header: "Projected Value",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("projected_actual_value"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];

