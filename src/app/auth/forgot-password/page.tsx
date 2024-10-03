"use client";

import { useState, FormEvent } from "react";
import { api } from "~/trpc/react"; // tRPC client hook
import CustomInputField from "../../_components/InputField"; // Your reusable input field component

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>(""); // State to store email input
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<boolean>(false); // Success state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Manually track loading state

  // Use tRPC to handle the requestPasswordReset mutation
  const requestPasswordReset = api.auth.requestPasswordReset.useMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true); // Set loading to true when request starts

    try {
      await requestPasswordReset.mutateAsync({ email }); // Pass the email to requestPasswordReset
      setSuccess(true); // On success, set success state to true
    } catch (err) {
      setError((err as Error).message); // Handle any errors
    } finally {
      setIsLoading(false); // Set loading to false when request completes
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {success ? (
        <p className="text-green-600">Check your email for a password reset link. The email should be in your inbox within 5 minutes.
         If you cannot find it please check your spam folder.Token Expires in 1 hour. Thank you.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CustomInputField
            id="email"
            label="Email Address"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            error={error || undefined}
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded"
            disabled={isLoading} // Using manually managed isLoading state
          >
            {isLoading ? "Submitting..." : "Request Reset"}
          </button>
        </form>
      )}
    </div>
  );
}
