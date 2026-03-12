import type { ColumnDef } from "@tanstack/react-table";
import type { ReportItem } from "@/lib/analytics-api";

const formatCurrency = (amount: string | number | null) => {
  if (amount === null || amount === undefined || amount === '') return '-'
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

export const reportsColumns: ColumnDef<ReportItem>[] = [
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
    id: "matter_phase",
    accessorKey: "matter_phase",
    header: "Phase",
    cell: ({ row }) => <div>{row.getValue("matter_phase")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "conservative_attorney_fee",
    accessorKey: "conservative_attorney_fee",
    header: "Conservative Fee",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("conservative_attorney_fee"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "llf_attorney_fee",
    accessorKey: "llf_attorney_fee",
    header: "LLF Fee",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("llf_attorney_fee"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];

