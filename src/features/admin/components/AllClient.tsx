import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminClients } from "../hooks/use-admin";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Main } from "@/components/layout/main";
import { Edit } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import EditClientModal from "./EditClientModal";
import type { ClientListItem } from "@/lib/admin-api";

export default function AllClient() {
  const { data: clients = [], isLoading: loading, error, refetch } = useAdminClients();
  const { user } = useAuthStore();
  const [clientNameFilter, setClientNameFilter] = useState<string | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<ClientListItem | null>(null);

  const errorMsg = error instanceof Error ? error.message : error ? String(error) : null;

  //FILTERED CLIENT LIST
  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !term ||
      client.clientName.toLowerCase().includes(term) ||
      (client.clientDescription ?? "").toLowerCase().includes(term) ||
      client.clientId.toLowerCase().includes(term);

    const matchesClientName =
      clientNameFilter === "ALL" || client.clientName === clientNameFilter;

    return matchesSearch && matchesClientName;
  });


  const clientNameOptions = Array.from(
    new Set(clients.map((c) => c.clientName))
  ).sort((a, b) => a.localeCompare(b));


  return (
    <Main fluid>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Admin Clients</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Search Box */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">

              {/* Search input */}
              <div className="flex-1">
                <Input
                  placeholder="Search clients by name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Client name dropdown */}
              <div className="w-full md:w-52">
                <Select
                  value={clientNameFilter}
                  onValueChange={(value) =>
                    setClientNameFilter(value as string | "ALL")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by client" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ALL">All Clients</SelectItem>

                    {clientNameOptions.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardContent>
        </Card>


        {/* Error */}
        {errorMsg && (
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-red-600">
                {errorMsg}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && !clients.length && (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              Loading clients...
            </CardContent>
          </Card>
        )}

        {/* No data */}
        {!loading && clients.length === 0 && !error && (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No clients found.
            </CardContent>
          </Card>
        )}

        {/* No search results */}
        {!loading &&
          clients.length > 0 &&
          filteredClients.length === 0 && (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No clients match your search.
              </CardContent>
            </Card>
          )}

        {/* Table */}
        {!loading && filteredClients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Clients ({filteredClients.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">Client ID</th>
                      <th className="py-2 pr-4">Created At</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr
                        key={client.clientId}
                        className="border-b last:border-0"
                      >
                        <td className="py-2 pr-4 font-medium">
                          {client.clientName}
                        </td>

                        <td className="py-2 pr-4 text-xs text-muted-foreground">
                          {client.clientDescription || "—"}
                        </td>

                        <td className="py-2 pr-4 text-xs">
                          {client.clientId}
                        </td>

                        <td className="py-2 pr-4 text-xs text-muted-foreground">
                          {new Date(client.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          {(user?.role === "SUPER_ADMIN" || (user?.role === "CLIENT_ADMIN" && user.clientId === client.clientId)) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingClient(client)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {editingClient && (
        <EditClientModal
          open={!!editingClient}
          onClose={() => setEditingClient(null)}
          clientId={editingClient.clientId}
          clientName={editingClient.clientName}
        />
      )}
    </Main>
  );
}
