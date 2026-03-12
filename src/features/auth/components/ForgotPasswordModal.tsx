import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EnterEmailStep from "./EnterEmailStep";
import ResetPasswordStep from "./ResetPasswordStep";
import { showSuccessToast } from "@/lib/toast";
import { Lock, Mail, Shield } from "lucide-react";

type Step = "email" | "reset" | "success";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setStep("email");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading">Reset Password</DialogTitle>
              <DialogDescription className="mt-1">
                {step === "email" 
                  ? "Enter your email to receive a verification code"
                  : "Enter the code and your new password"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === "email" && (
            <>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm text-muted-foreground">
                  We'll send a verification code to your email address to reset your password securely.
                </div>
              </div>
              <EnterEmailStep
                onSubmit={(email) => {
                  setEmail(email);
                  setStep("reset");
                }}
              />
            </>
          )}

          {step === "reset" && (
            <>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm text-muted-foreground">
                  Check your email for the verification code. Enter it along with your new password below.
                </div>
              </div>
              <ResetPasswordStep
                email={email}
                onSuccess={() => {
                  showSuccessToast("Password reset successfully");
                  handleClose();
                }}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
