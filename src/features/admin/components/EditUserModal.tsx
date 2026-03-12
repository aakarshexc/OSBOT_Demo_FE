import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAdminRoles } from "../hooks/use-admin";
import { EditUserModalProps, RoleName, UpdateUserRequest } from "../admin.type";

export default function EditUserModal({
  user,
  availableRoles: _availableRoles,
  loading,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const { user: loggedInUser } = useAuthStore();
  const { data: rolesData = [], isLoading: rolesLoading, error: rolesError } = useAdminRoles();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [roleName, setRoleName] = useState<RoleName | "">("");
  const [password, setPassword] = useState("");

  // Filter roles based on logged-in user's role
  const roles = loggedInUser?.role === "SUPER_ADMIN" 
    ? rolesData 
    : rolesData.filter(role => role.roleName !== "SUPER_ADMIN");
  
  const rolesErrorMsg = rolesError instanceof Error ? rolesError.message : rolesError ? String(rolesError) : null;

  useEffect(() => {
    if (
      ["SUPER_ADMIN", "CLIENT_ADMIN", "STAFF", "OBSERVER"].includes(user.role)
    ) {
      setRoleName(user.role as RoleName);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateUserRequest = {};

    if (name !== user.name) payload.name = name;
    if (email !== user.email) payload.email = email;
    if (roleName && roleName !== user.role) payload.roleName = roleName;
    if (password.trim()) payload.password = password.trim();

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={roleName || undefined}
                onValueChange={(v) => setRoleName(v as RoleName)}
                disabled={rolesLoading}
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      rolesLoading
                        ? "Loading roles..."
                        : "Select role"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.roleId} value={role.roleName}>
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
              {rolesErrorMsg && (
                <p className="text-xs text-red-500 mt-1">
                  {rolesErrorMsg}
                </p>
              )}
            </div>

            <div>
              <Label>New Password (optional)</Label>
              <Input
                type="password"
                placeholder="Leave blank to keep old password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
