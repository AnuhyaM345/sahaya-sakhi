//frontend/app/login/page.tsx
'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, 
      });      

      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // Decode the JWT to get user info
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id; // Assuming the JWT has the `id` field

      // Store userId in localStorage
      localStorage.setItem("userId", userId);

      const role = decoded.role;

      if (role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/user-dashboard");
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.71)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 space-y-6 border border-white/40"
      >
        <h1 className="text-3xl font-extrabold text-center text-[#5C068C] tracking-tight">
          Sahaya Sakhi Login
        </h1>
  
        <input
          type="email"
          className="border border-gray-300 p-3 w-full rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C068C]"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
  
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="border border-gray-300 p-3 w-full rounded-xl pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C068C]"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-3 text-gray-500 hover:text-[#5C068C] transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
  
        <button
          type="submit"
          className="bg-[#5C068C] hover:bg-[#45045f] text-white px-6 py-3 rounded-full w-full font-semibold shadow-md transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
