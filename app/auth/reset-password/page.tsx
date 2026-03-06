"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updatePasswordWithToken } from "@/app/actions/update-password";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Main Logic Component
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleReset = async (formData: FormData) => {
    const newPass = formData.get("password") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsPending(true);
    try {
      const res = await updatePasswordWithToken(token, newPass);
      if (res.success) {
        toast.success(res.success);
        router.push("/");
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update password.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="New Password"
              required
              minLength={6}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Default Export with Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="flex justify-center mt-20">Loading...</div>}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
