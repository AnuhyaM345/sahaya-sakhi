"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("User registered! Now login.");
      router.push("/login");
    } else {
      const error = await response.json();
      alert(`Error: ${error.detail || "Registration failed."}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#fce3ff] to-[#e0c3fc]">
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-center text-[#5C068C] mb-6 tracking-tight">
            Create Your Account
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b268d1] focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b268d1] focus:outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#b268d1] focus:outline-none"
            />

            <button
              type="submit"
              className="mt-4 bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold py-3 rounded-lg transition-all"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#5C068C] hover:underline cursor-pointer font-medium"
            >
              Login here
            </span>
          </p>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Sahaya Sakhi. All rights reserved to <span className="font-semibold text-[#5C068C]">Anuhya Mattaparthi</span>.
      </footer>
    </div>
  );
}
