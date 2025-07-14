"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (!decoded || decoded.role !== "admin") {
        throw new Error("Unauthorized role");
      }

      // ✅ Authorized
      setIsAuthorized(true);
    } catch (err) {
      console.error("Authorization error:", err);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!isAuthorized) {
    return <p className="text-center mt-10 text-gray-500">Checking access...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-lg">Only admins can see this page.</p>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-10 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
