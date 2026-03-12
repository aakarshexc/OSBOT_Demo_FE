import type { ColumnDef } from "@tanstack/react-table";
import type { Prospect } from "@/lib/analytics-api";

export const prospectsColumns: ColumnDef<Prospect>[] = [
  {
    id: "prospect_number",
    accessorKey: "prospect_number",
    header: "Prospect #",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("prospect_number") || row.original.prospect_sf_id}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: "Name",
    cell: ({ row }) => (
      <div>{`${row.original.first_name} ${row.original.last_name}`}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "client_email",
    accessorKey: "client_email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("client_email")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "mobile_phone",
    accessorKey: "mobile_phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("mobile_phone")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "intake_status",
    accessorKey: "intake_status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("intake_status")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "lead_score",
    accessorKey: "lead_score",
    header: "Score",
    cell: ({ row }) => <div>{row.getValue("lead_score")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "lead_source",
    accessorKey: "lead_source",
    header: "Source",
    cell: ({ row }) => <div>{row.getValue("lead_source")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
];

