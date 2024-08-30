"use client";

import CustomInputField from "../../_components/InputField";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="container w-[400px]">
        <h5 className="mb-10 text-lg font-bold tracking-tight sm:text-[3rem]">
          Reset Password
        </h5>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CustomInputField
            id="email"
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <Link href="/admin/login" className="text-blue-500 underline">
            Back to Login
          </Link>

          <button
            type="submit"
            className="w-full items-center justify-center rounded bg-gray-500 p-2 text-white"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
