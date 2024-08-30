"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import Link from 'next/link'
import CustomInputField from "../../_components/InputField";

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Authenticate with SignIn
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      // Error for Incorrect Credentials
      setErrorMessage('Invalid email or password.');
    } else {
      // If no Errors go to Admin Dashboard
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h5 className="text-lg font-bold tracking-tight sm:text-[5rem]">
          Login
        </h5>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
          <CustomInputField
            id="email"
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}
            required={true}
          />
          <CustomInputField
            id="password"
            label="Password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={e => setPassword(e.target.value)}
            required={true}
          />
          <Link href="/admin/reset-password" className="underline text-blue-500">Forgot Password?</Link>
          <button type="submit" className="bg-gray-500 text-white p-2 rounded justify-center items-center"> Sign In</button>
        </form>
      </div>
    </main>
  );
}
