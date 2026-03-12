import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

import { Main } from "@/components/layout/main";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useCreateClient } from "../hooks/use-admin";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Spinner } from "@/components/ui/spinner";

export function CreateClient() {
  const { user } = useAuthStore();
  const createClientMutation = useCreateClient();

  const [clientName, setClientName] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const loading = createClientMutation.isPending;

  if (!user) {
    return (
      <div className="p-4 text-center text-red-600">
        You must be logged in to create client.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      clientName,
      clientDescription,
      adminEmail,
      adminName,
      adminPassword,
    };

    createClientMutation.mutate(payload, {
      onSuccess: () => {
        showSuccessToast("Client created successfully!");
        // Reset form
        setClientName("");
        setClientDescription("");
        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to create client.";
        showErrorToast(msg);
      },
    });
  };

  return (
    <Main fluid>
      <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Client</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Client Name</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Client Description</Label>
            <Input
              value={clientDescription}
              onChange={(e) => setClientDescription(e.target.value)}
              placeholder="Client purpose or description"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Admin Name</Label>
            <Input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Admin full name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Admin Email</Label>
            <Input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Admin email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Admin Password</Label>
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin login password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="ml-2" /> : "Create Client"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </Main>
  );
}
