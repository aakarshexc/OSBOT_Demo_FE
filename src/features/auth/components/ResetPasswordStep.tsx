import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showErrorToast } from "@/lib/toast";
import api from "@/utils/axiosInstance";
import { Spinner } from "@/components/ui/spinner";
import { Lock, KeyRound } from "lucide-react";

interface Props {
  email: string;
  onSuccess: () => void;
}

export default function ResetPasswordStep({ email, onSuccess }: Props) {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || otp.length !== 6) {
      showErrorToast("Please enter a valid 6-digit OTP");
      return;
    }

    if (!password || !confirmPassword) {
      showErrorToast("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
        confirmPassword
      });

      if (res.data?.success) {
        onSuccess();
      } else {
        showErrorToast(res.data?.error || "Password reset failed");
      }
    } catch (err) {
      const errorMessage = 
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 
        "Invalid or expired OTP"
      showErrorToast(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* OTP */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Verification Code</Label>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-sm font-medium">
          New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="pl-10 h-11"
            disabled={loading}
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="pl-10 h-11"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        className="w-full h-11 text-base font-semibold"
        onClick={handleReset}
        disabled={!otp || !password || !confirmPassword || loading}
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </div>
  );
}
