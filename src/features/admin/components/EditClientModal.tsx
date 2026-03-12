import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { adminApi, SalesforceVariables } from "@/lib/admin-api";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface EditClientModalProps {
    clientId: string;
    clientName: string;
    open: boolean;
    onClose: () => void;
}

export default function EditClientModal({
    clientId,
    clientName,
    open,
    onClose,
}: EditClientModalProps) {
    const [loading, setLoading] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    // Form state
    // We initialize with empty strings as we don't have the current values
    // and these are for updating the configuration.
    const [formData, setFormData] = useState<SalesforceVariables>({
        SALESFORCE_AUTH_URL: "",
        SALESFORCE_INSTANCE_URL: "",
        SALESFORCE_CLIENT_ID: "",
        SALESFORCE_CLIENT_SECRET: "",
        SALESFORCE_API_VERSION: "v59.0", // Default version
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.SALESFORCE_AUTH_URL || !formData.SALESFORCE_CLIENT_ID || !formData.SALESFORCE_CLIENT_SECRET) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            await adminApi.updateClient(clientId, {
                salesforceVariables: formData,
            });
            toast.success("Client configuration updated successfully");
            onClose();
            // Reset form
            setFormData({
                SALESFORCE_AUTH_URL: "",
                SALESFORCE_INSTANCE_URL: "",
                SALESFORCE_CLIENT_ID: "",
                SALESFORCE_CLIENT_SECRET: "",
                SALESFORCE_API_VERSION: "v59.0",
            });
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to update client";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Client: {clientName}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="SALESFORCE_AUTH_URL">Salesforce Auth URL</Label>
                        <Input
                            id="SALESFORCE_AUTH_URL"
                            name="SALESFORCE_AUTH_URL"
                            placeholder="https://login.salesforce.com/services/oauth2/token"
                            value={formData.SALESFORCE_AUTH_URL}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="SALESFORCE_INSTANCE_URL">Salesforce Instance URL</Label>
                        <Input
                            id="SALESFORCE_INSTANCE_URL"
                            name="SALESFORCE_INSTANCE_URL"
                            placeholder="https://your-instance.my.salesforce.com"
                            value={formData.SALESFORCE_INSTANCE_URL}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="SALESFORCE_API_VERSION">Salesforce API Version</Label>
                        <Input
                            id="SALESFORCE_API_VERSION"
                            name="SALESFORCE_API_VERSION"
                            placeholder="v59.0"
                            value={formData.SALESFORCE_API_VERSION}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="SALESFORCE_CLIENT_ID">Salesforce Client ID</Label>
                        <div className="relative">
                            <Input
                                id="SALESFORCE_CLIENT_ID"
                                name="SALESFORCE_CLIENT_ID"
                                placeholder="Enter Client ID"
                                value={formData.SALESFORCE_CLIENT_ID}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="SALESFORCE_CLIENT_SECRET">Salesforce Client Secret</Label>
                        <div className="relative">
                            <Input
                                id="SALESFORCE_CLIENT_SECRET"
                                name="SALESFORCE_CLIENT_SECRET"
                                type={showSecret ? "text" : "password"}
                                placeholder="Enter Client Secret"
                                value={formData.SALESFORCE_CLIENT_SECRET}
                                onChange={handleChange}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSecret(!showSecret)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showSecret ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle password visibility</span>
                            </button>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
