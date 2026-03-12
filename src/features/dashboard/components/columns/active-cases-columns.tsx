import type { ColumnDef } from "@tanstack/react-table";
import type { ActiveCase } from "@/lib/analytics-api";

const formatCurrency = (amount: string | number | null) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

export const activeCasesColumns: ColumnDef<ActiveCase>[] = [
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
    id: "case_type",
    accessorKey: "case_type",
    header: "Case Type",
    cell: ({ row }) => <div>{row.getValue("case_type")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "matter_phase",
    accessorKey: "matter_phase",
    header: "Phase",
    cell: ({ row }) => <div>{row.getValue("matter_phase") || row.original.projection_matter_phase}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "case_open_date",
    accessorKey: "case_open_date",
    header: "Open Date",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("case_open_date") || row.original.matter_created_date)}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "projected_future_value",
    accessorKey: "projected_future_value",
    header: "Projected Value",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("projected_future_value"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "projected_actual_value",
    accessorKey: "projected_actual_value",
    header: "Actual Value",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("projected_actual_value"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "total_settlement_amount",
    accessorKey: "total_settlement_amount",
    header: "Total Settlement",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("total_settlement_amount"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "latest_offer_amount",
    accessorKey: "latest_offer_amount",
    header: "Latest Offer",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("latest_offer_amount"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];

