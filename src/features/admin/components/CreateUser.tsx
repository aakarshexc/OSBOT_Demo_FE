import { useState } from "react";

import { useAuthStore } from "@/stores/auth-store";
import { Main } from "@/components/layout/main";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RoleName } from "../admin.type";
import {
  useAdminClients,
  useAdminRoles,
  useCreateUser,
} from "../hooks/use-admin";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Spinner } from "@/components/ui/spinner";

export default function CreateUser() {
  const { user } = useAuthStore();
  const createUserMutation = useCreateUser();
  
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useAdminClients();
  const { data: rolesData = [], isLoading: rolesLoading, error: rolesError } = useAdminRoles();
  
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [roleName, setRoleName] = useState<RoleName | "">("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const loading = createUserMutation.isPending;

  // Password validation function
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-red-600">
        You must be logged in to create users.
      </div>
    );
  }

  // Filter roles based on user role
  const roles = user?.role === "SUPER_ADMIN" 
    ? rolesData 
    : rolesData.filter(role => role.roleName !== "SUPER_ADMIN");
  
  const clientsErrorMsg = clientsError instanceof Error ? clientsError.message : clientsError ? String(clientsError) : null;
  const rolesErrorMsg = rolesError instanceof Error ? rolesError.message : rolesError ? String(rolesError) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      showErrorToast(passwordValidationError);
      return;
    }

    if (!roleName) {
      showErrorToast("Please select a role.");
      return;
    }

    if (user?.role === "SUPER_ADMIN") {
      if (!selectedClientId) {
        showErrorToast("Please select a client.");
        return;
      }
    }

    const payload = {
      email,
      name,
      password,
      roleName,
      ...(user?.role === "SUPER_ADMIN" && selectedClientId ? { clientId: selectedClientId } : {}),
    };

    createUserMutation.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("User created successfully!");
        setEmail("");
        setName("");
        setPassword("");
        setRoleName("");
        setSelectedClientId("");
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to create user.";
        showErrorToast(msg);
      },
    });
  };

  return (
    <Main fluid>
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold tracking-tight">Create User</h1>
        <p className="text-muted-foreground mt-2">
          Add a new user to the system. Fill in all required fields below.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">User Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-base"
                  disabled={loading}
                />
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 text-base"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-base font-medium">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  required
                  type="password"
                  placeholder="Enter password (min 8 chars, uppercase, lowercase, number, special char)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) {
                      setPasswordError("");
                    }
                  }}
                  className={`h-11 text-base ${passwordError ? "border-destructive" : ""}`}
                  disabled={loading}
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-1">
                    {passwordError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                </p>
              </div>

              {/* Role Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="role" className="text-base font-medium">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={roleName}
                  onValueChange={(value: string) =>
                    setRoleName(value as RoleName)
                  }
                  disabled={rolesLoading || loading}
                >
                  <SelectTrigger id="role" className="h-11 text-base">
                    <SelectValue 
                      placeholder={
                        rolesLoading
                          ? "Loading roles..."
                          : "Select Role"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.roleId} value={role.roleName}>
                        <div className="flex items-center justify-between w-full">
                          <span>{role.roleName}</span>
                          {role.isGlobal && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (Global)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {rolesErrorMsg && (
                  <p className="text-sm text-destructive mt-1">
                    {rolesErrorMsg}
                  </p>
                )}
              </div>

              {/* Client Field - Only for SUPER_ADMIN */}
              {user.role === "SUPER_ADMIN" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="client" className="text-base font-medium">
                    Client <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedClientId}
                    onValueChange={(value: string) => setSelectedClientId(value)}
                    disabled={clientsLoading || !!clientsError || loading}
                  >
                    <SelectTrigger id="client" className="h-11 text-base">
                      <SelectValue
                        placeholder={
                          clientsLoading
                            ? "Loading clients..."
                            : "Select Client"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem
                          key={client.clientId}
                          value={client.clientId}
                        >
                          {client.clientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {clientsErrorMsg && (
                    <p className="text-sm text-destructive mt-1">
                      {clientsErrorMsg}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                type="submit" 
                size="lg"
                className="min-w-[140px] h-11 text-base font-medium" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Main>
  );
}
