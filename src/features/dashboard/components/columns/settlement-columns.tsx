import type { ColumnDef } from "@tanstack/react-table";
import type { SettlementCase } from "@/lib/analytics-api";

const formatCurrency = (amount: string | number | null) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

export const settlementColumns: ColumnDef<SettlementCase>[] = [
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
    cell: ({ row }) => <div>{row.getValue("matter_phase")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "total_settlement_amount",
    accessorKey: "total_settlement_amount",
    header: "Settlement Amount",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("total_settlement_amount"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];

