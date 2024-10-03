// src/app/auth/reset-password/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation"; 
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react"; 
import CustomInputField from "../../_components/InputField"; 

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const token = searchParams.get('token'); // Capture token from URL

  const resetPassword = api.auth.resetPassword.useMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!token) {
      setError("No reset token provided.");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, newPassword });
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 3000); 
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {success ? (
        <p className="text-green-600">Password has been successfully reset! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CustomInputField
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            placeholder="Enter your new password"
            onChange={(e) => setNewPassword(e.target.value)}
            required={true}
            error={error || undefined}
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
}

