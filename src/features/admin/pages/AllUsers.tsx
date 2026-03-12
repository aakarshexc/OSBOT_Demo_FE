

// import { useEffect, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { Pencil } from "lucide-react";

// import type { RootState } from "@/store";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// import EditUserModal from "../components/EditUserModal";
// import { RoleName, UpdateUserRequest, UserListItem } from "../admin.type";
// import { fetchAdminUsers, updateAdminUser } from "../services/adminService";

// export default function AllUsers() {
//   const { user: loggedInUser, token } = useSelector(
//     (state: RootState) => state
//   );

//   const authToken = token || localStorage.getItem("token") || "";

//   const [users, setUsers] = useState<UserListItem[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
//   const [updateError, setUpdateError] = useState<string | null>(null);
//   const [updateLoading, setUpdateLoading] = useState(false);

//   // filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState<RoleName | "ALL">("ALL");

//   const availableRoles: RoleName[] =
//     loggedInUser?.role === "SUPER_ADMIN"
//       ? ["SUPER_ADMIN", "CLIENT_ADMIN", "STAFF", "OBSERVER"]
//       : ["CLIENT_ADMIN", "STAFF", "OBSERVER"];

//   const loadUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchAdminUsers(authToken);
//       setUsers(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load users.");
//     } finally {
//       setLoading(false);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     void loadUsers();
//   }, [loadUsers]);

//   const handleUpdate = async (payload: UpdateUserRequest) => {
//     if (!editingUser) return;
//     setUpdateLoading(true);
//     setUpdateError(null);

//     try {
//       await updateAdminUser(authToken, editingUser.userId, payload);
//       await loadUsers();
//       setEditingUser(null);
//     } catch (err) {
//       setUpdateError(
//         err instanceof Error ? err.message : "Failed to update user."
//       );
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // derived filtered list
//   const filteredUsers = users.filter((u) => {
//     const term = searchTerm.trim().toLowerCase();

//     const matchesText =
//       !term ||
//       u.name.toLowerCase().includes(term) ||
//       u.email.toLowerCase().includes(term) ||
//       (u.clientName ?? "").toLowerCase().includes(term);

//     const matchesRole =
//       roleFilter === "ALL" ? true : u.role === roleFilter;

//     return matchesText && matchesRole;
//   });

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">All Users</h1>
//           <Button
//             onClick={loadUsers}
//             disabled={loading}
//             variant="outline"
//             size="sm"
//           >
//             {loading ? "Refreshing..." : "Refresh"}
//           </Button>
//         </div>

//         {/* Filters */}
//         <Card>
//           <CardContent className="py-4">
//             <div className="flex flex-col md:flex-row gap-3 md:items-center">
//               <div className="flex-1">
//                 <Input
//                   placeholder="Search by name, email, or client…"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div className="w-full md:w-52">
//                 <Select
//                   value={roleFilter}
//                   onValueChange={(value) =>
//                     setRoleFilter(value as RoleName | "ALL")
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Filter by role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL">All Roles</SelectItem>
//                     {availableRoles.map((role) => (
//                       <SelectItem key={role} value={role}>
//                         {role}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Error */}
//         {error && (
//           <Card>
//             <CardContent className="py-4">
//               <p className="text-red-600 text-sm">{error}</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Table */}
//         {!loading && filteredUsers.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base">
//                 Users ({filteredUsers.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="border-b text-left text-xs uppercase text-muted-foreground">
//                     <tr>
//                       <th className="py-2 pr-4">Name</th>
//                       <th className="py-2 pr-4">Email</th>
//                       <th className="py-2 pr-4">Role</th>
//                       <th className="py-2 pr-4">Client</th>
//                       <th className="py-2 pr-4">Created At</th>
//                       <th className="py-2 pr-4">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map((u) => (
//                       <tr key={u.userId} className="border-b last:border-0">
//                         <td className="py-2 pr-4">
//                           <div className="font-medium">{u.name}</div>
//                           {u.roleDescription && (
//                             <div className="text-xs text-muted-foreground">
//                               {u.roleDescription}
//                             </div>
//                           )}
//                         </td>
//                         <td className="py-2 pr-4">{u.email}</td>
//                         <td className="py-2 pr-4">{u.role}</td>
//                         <td className="py-2 pr-4">{u.clientName ?? "—"}</td>
//                         <td className="py-2 pr-4 text-xs text-muted-foreground">
//                           {new Date(u.createdAt).toLocaleString()}
//                         </td>
//                         <td className="py-2 pr-4">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setEditingUser(u)}
//                           >
//                             <Pencil className="h-4 w-4 mr-1" />
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* No data state */}
//         {!loading && users.length > 0 && filteredUsers.length === 0 && (
//           <Card>
//             <CardContent className="py-6 text-sm text-muted-foreground text-center">
//               No users match the current filters.
//             </CardContent>
//           </Card>
//         )}

//         {!loading && users.length === 0 && !errorMsg && (
//           <Card>
//             <CardContent className="py-6 text-sm text-muted-foreground text-center">
//               No users found.
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {editingUser && (
//         <EditUserModal
//           user={editingUser}
//           availableRoles={availableRoles}
//           loading={updateLoading}
//           error={updateError}
//           onClose={() => setEditingUser(null)}
//           onSubmit={handleUpdate}
//         />
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Pencil } from "lucide-react";

import { Main } from "@/components/layout/main";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { RoleName, UpdateUserRequest } from "../admin.type";
import { useAdminUsers, useUpdateUser } from "../hooks/use-admin";
import EditUserModal from "../components/EditUserModal";

export default function AllUsers() {
  const { user: loggedInUser } = useAuthStore();
  const { data: users = [], isLoading: loading, error, refetch } = useAdminUsers();
  const updateUserMutation = useUpdateUser();

  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleName | "ALL">("ALL");
  const [clientFilter, setClientFilter] = useState<string | "ALL">("ALL");

  const availableRoles: RoleName[] =
    loggedInUser?.role === "SUPER_ADMIN"
      ? ["SUPER_ADMIN", "CLIENT_ADMIN", "STAFF", "OBSERVER"]
      : ["CLIENT_ADMIN", "STAFF", "OBSERVER"];

  const handleUpdate = async (payload: UpdateUserRequest) => {
    if (!editingUser) return;
    setUpdateError(null);

    updateUserMutation.mutate(
      { userId: editingUser.userId, payload },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
        onError: (err) => {
          setUpdateError(
            err instanceof Error ? err.message : "Failed to update user."
          );
        },
      }
    );
  };
  
  const updateLoading = updateUserMutation.isPending;
  const errorMsg = error instanceof Error ? error.message : error ? String(error) : null;

  // client options (unique client names)
  const clientOptions = Array.from(
    new Set(
      users
        .map((u) => u.clientName)
        .filter((name): name is string => Boolean(name))
    )
  ).sort((a, b) => a.localeCompare(b));

  //derived filtered list
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.trim().toLowerCase();

    const matchesText =
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.clientName ?? "").toLowerCase().includes(term);

    const matchesRole =
      roleFilter === "ALL" ? true : u.role === roleFilter;

    const matchesClient =
      clientFilter === "ALL"
        ? true
        : (u.clientName ?? "") === clientFilter;

    return matchesText && matchesRole && matchesClient;
  });

  const isSuperAdmin = loggedInUser?.role === "SUPER_ADMIN";

  return (
    <Main fluid>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Users</h1>
          <Button
            onClick={() => refetch()}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or client…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Role filter */}
              <div className="w-full md:w-52">
                <Select
                  value={roleFilter}
                  onValueChange={(value) =>
                    setRoleFilter(value as RoleName | "ALL")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client filter */}
              {isSuperAdmin && 
              <div className="w-full md:w-52">
                <Select
                  value={clientFilter}
                  onValueChange={(value) =>
                    setClientFilter(value as string | "ALL")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Clients</SelectItem>
                    {clientOptions.map((clientName) => (
                      <SelectItem key={clientName} value={clientName}>
                        {clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
}
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {errorMsg && (
          <Card>
            <CardContent className="py-4">
              <p className="text-red-600 text-sm">{errorMsg}</p>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {!loading && filteredUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Client</th>
                      <th className="py-2 pr-4">Created At</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.userId} className="border-b last:border-0">
                        <td className="py-2 pr-4">
                          <div className="font-medium">{u.name}</div>
                          {u.roleDescription && (
                            <div className="text-xs text-muted-foreground">
                              {u.roleDescription}
                            </div>
                          )}
                        </td>
                        <td className="py-2 pr-4">{u.email}</td>
                        <td className="py-2 pr-4">{u.role}</td>
                        <td className="py-2 pr-4">{u.clientName ?? "—"}</td>
                        <td className="py-2 pr-4 text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(u)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No data state */}
        {!loading && users.length > 0 && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground text-center">
              No users match the current filters.
            </CardContent>
          </Card>
        )}

        {!loading && users.length === 0 && !errorMsg && (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground text-center">
              No users found.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          availableRoles={availableRoles}
          loading={updateLoading}
          error={updateError}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdate}
        />
      )}
    </Main>
  );
}
