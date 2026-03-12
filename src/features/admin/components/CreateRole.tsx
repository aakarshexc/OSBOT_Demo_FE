import { useState, useEffect } from "react";

import { Main } from "@/components/layout/main";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuthStore } from "@/stores/auth-store";
import { Spinner } from "@/components/ui/spinner";
import {
  useAdminRoles,
  useAdminPermissions,
  useRolePermissions,
  useCreateOrUpdateRole,
} from "../hooks/use-admin";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export function CreateRole() {
  const { user } = useAuthStore();
  const createOrUpdateRoleMutation = useCreateOrUpdateRole();
  
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  
  const { data: rolesData = [], isLoading: rolesLoading, refetch: refetchRoles } = useAdminRoles();
  const { data: permissionsData = [], isLoading: permissionsLoading } = useAdminPermissions();
  const { data: rolePermissionsData = [], isLoading: rolePermissionsLoading } = useRolePermissions(selectedRoleId);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const loading = createOrUpdateRoleMutation.isPending;
  const roles = rolesData;
  const permissions = permissionsData;

  // Update selected permissions when role permissions load
  // This hook must be called before any early returns
  useEffect(() => {
    if (rolePermissionsData.length > 0 && selectedRoleId) {
      const rolePermissionNames = rolePermissionsData.map((p) => p.permissionName);
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setSelectedPermissions(rolePermissionNames);
      }, 0);
    }
  }, [rolePermissionsData, selectedRoleId]);

  if (!user) {
    return (
      <div className="p-4 text-center text-red-600">
        You must be logged in to create role.
      </div>
    );
  }

  // Check if user is super admin or client admin
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isClientAdmin = user.role === "CLIENT_ADMIN";

  if (!isSuperAdmin && !isClientAdmin) {
    return (
      <div className="p-4 text-center text-red-600">
        Only Super Admin or Client Admin can create roles.
      </div>
    );
  }

  const handleRoleSelect = (value: string) => {
    if (value === "create-new") {
      setIsCreatingNew(true);
      setSelectedRoleId("");
      setRoleName("");
      setRoleDescription("");
      setSelectedPermissions([]);
    } else {
      setIsCreatingNew(false);
      setSelectedRoleId(value);
      const selectedRole = roles.find((r) => r.roleId === value);
      if (selectedRole) {
        setRoleName(selectedRole.roleName);
        setRoleDescription(selectedRole.roleDescription || "");
      }
    }
  };

  const handlePermissionToggle = (permissionName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleSelectAll = () => {
    const allPermissionNames = permissions.map((p) => p.permissionName);
    setSelectedPermissions(allPermissionNames);
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleClear = () => {
    setRoleName("");
    setRoleDescription("");
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert permission names to permission IDs
    const permissionIds = permissions
      .filter((p) => selectedPermissions.includes(p.permissionName))
      .map((p) => p.permissionId);

    const payload = {
      ...(selectedRoleId && !isCreatingNew ? { roleId: selectedRoleId } : {}),
      roleName,
      roleDescription,
      permissionIds,
    };

    createOrUpdateRoleMutation.mutate(payload, {
      onSuccess: () => {
        const successMsg = isCreatingNew
          ? "Role created successfully!"
          : "Role updated successfully!";
        showSuccessToast(successMsg);

        // Reset form to initial state
        setRoleName("");
        setRoleDescription("");
        setSelectedPermissions([]);
        setIsCreatingNew(false);
        setSelectedRoleId("");

        // Reload roles list
        refetchRoles();
      },
      onError: (error) => {
        const msg =
          error instanceof Error
            ? error.message
            : isCreatingNew
            ? "Failed to create role."
            : "Failed to update role.";
        showErrorToast(msg);
      },
    });
  };

  return (
    <Main fluid>
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold tracking-tight">Create Role</h1>
        <p className="text-muted-foreground mt-2">
          Create or update roles and assign permissions. Select an existing role to edit or create a new one.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">Role Information</CardTitle>
        </CardHeader>

        <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="roleSelect" className="text-base font-medium">
              Role Name <span className="text-destructive">*</span>
            </Label>
            <Select
              value={isCreatingNew ? "create-new" : selectedRoleId}
              onValueChange={handleRoleSelect}
              disabled={rolesLoading}
            >
              <SelectTrigger id="roleSelect" className="h-11 text-base">
                <SelectValue placeholder="Select a role or create new">
                  {rolesLoading
                    ? "Loading roles..."
                    : isCreatingNew
                    ? "Create role"
                    : selectedRoleId
                    ? roles.find((r) => r.roleId === selectedRoleId)?.roleName
                    : "Select a role or create new"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create-new">Create role</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.roleId} value={role.roleId}>
                    {role.roleName}
                    {role.isGlobal && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (Global)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCreatingNew && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="newRoleName" className="text-base font-medium">
                New Role Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newRoleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                required
                className="h-11 text-base"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="roleDescription" className="text-base font-medium">
              Role Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Enter role description"
              rows={4}
              required
              readOnly={!isCreatingNew && selectedRoleId !== ""}
              className={`text-base ${!isCreatingNew && selectedRoleId !== "" ? "bg-muted" : ""}`}
            />
          </div>

          {!isCreatingNew && selectedRoleId && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                {!rolePermissionsLoading && permissions.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={
                      selectedPermissions.length === permissions.length
                        ? handleDeselectAll
                        : handleSelectAll
                    }
                  >
                    {selectedPermissions.length === permissions.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </div>
              {rolePermissionsLoading && selectedRoleId ? (
                <div className="flex items-center justify-center p-8">
                  <Spinner className="mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading role permissions...
                  </span>
                </div>
              ) : permissions.length === 0 ? (
                <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
                  No permissions available.
                </div>
              ) : (
                <>
                  <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => {
                        const isChecked = selectedPermissions.includes(permission.permissionName);
                        return (
                          <label
                            key={permission.permissionId}
                            className="flex items-start gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handlePermissionToggle(permission.permissionName)}
                              className="w-4 h-4 mt-0.5"
                              disabled={rolePermissionsLoading}
                            />
                            <div className="flex flex-col">
                              <span className="select-none font-medium">
                                {permission.permissionName}
                              </span>
                              {permission.permissionDescription && (
                                <span className="select-none text-xs text-muted-foreground">
                                  {permission.permissionDescription}
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {selectedPermissions.length} of {permissions.length} selected
                  </div>
                </>
              )}
            </div>
          )}

          {isCreatingNew && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                {!permissionsLoading && permissions.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={
                      selectedPermissions.length === permissions.length
                        ? handleDeselectAll
                        : handleSelectAll
                    }
                  >
                    {selectedPermissions.length === permissions.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </div>
              {permissionsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Spinner className="mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading permissions...
                  </span>
                </div>
              ) : permissions.length === 0 ? (
                <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
                  No permissions available. You don't have permission to assign any permissions.
                </div>
              ) : (
                <>
                  <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <label
                          key={permission.permissionId}
                          className="flex items-start gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.permissionName)}
                            onChange={() => handlePermissionToggle(permission.permissionName)}
                            className="w-4 h-4 mt-0.5"
                          />
                          <div className="flex flex-col">
                            <span className="select-none font-medium">
                              {permission.permissionName}
                            </span>
                            {permission.permissionDescription && (
                              <span className="select-none text-xs text-muted-foreground">
                                {permission.permissionDescription}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {selectedPermissions.length} of {permissions.length} selected
                  </div>
                </>
              )}
            </div>
          )}

          {isCreatingNew && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-w-[120px] h-11 text-base font-medium"
                onClick={handleClear}
                disabled={loading || rolesLoading}
              >
                Clear
              </Button>
              <Button
                type="submit"
                size="lg"
                className="min-w-[140px] h-11 text-base font-medium"
                disabled={loading || rolesLoading || permissionsLoading}
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create Role"
                )}
              </Button>
            </div>
          )}

          {!isCreatingNew && selectedRoleId && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="submit"
                size="lg"
                className="min-w-[140px] h-11 text-base font-medium"
                disabled={loading || rolesLoading || (rolePermissionsLoading && !!selectedRoleId)}
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
    </Main>
  );
}
