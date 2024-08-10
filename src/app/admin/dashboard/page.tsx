"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) {
      router.push("/admin/login");
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>; 
  }

  if (!session) {
    return null; 
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
      {/* Admin-specific content */}
    </div>
  );
}
