import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import api from "@/utils/axiosInstance";
import { Spinner } from "@/components/ui/spinner";
import { Mail } from "lucide-react";

interface Props {
  onSubmit: (email: string) => void;
}

export default function EnterEmailStep({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", { email });

      if (res.data.success) {
        showSuccessToast(res.data.message);
        onSubmit(email);
      }
    } catch (err) {
      const errorMessage = 
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 
        "Something went wrong"
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="lawyer@lawfirm.com"
            className="pl-10 h-11"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        className="w-full h-11 text-base font-semibold"
        onClick={handleSubmit}
        disabled={!email || loading}
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </Button>
    </div>
  );
}
