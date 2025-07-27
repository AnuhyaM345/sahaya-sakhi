'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import '../globals.css';


export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await api.get('/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('User verification failed', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cover bg-center" style={{
      backgroundImage: "url('/user.jpg')",
      backgroundColor: 'rgba(0, 0, 0, 0.71)',
      backgroundBlendMode: 'overlay',
    }}>
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-center relative border border-white/50">
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-full shadow-md transition"
          >
            Logout
          </button>

          <h1 className="text-3xl font-extrabold mb-2 text-[#5C068C]">Welcome, {user?.name || 'User'}!🌸</h1>
          <p className="text-gray-700 text-lg mb-6">
            You are logged in as <strong>{user?.role}</strong>.
          </p>

          <a
            href="/chat-voice"
            className="inline-block bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            💬 Chat with Sahaya Sakhi
          </a>

          <a
            href="/talent-recognition"
            className="inline-block bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition mt-3"
          >
            ✨ Talent Recognition System
          </a>

          <a
            href="/scheme-support"
            className="inline-block bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition mt-3"
          >
            💵 Economic Support System
          </a>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="text-center py-4 text-sm text-white text-shadow-glow">
        © {new Date().getFullYear()} Sahaya Sakhi. All rights reserved to{' '}
        <span className="font-semibold text-[#5C068C]">
          Anuhya Mattaparthi
        </span>.
      </footer>

    </div>
  );
}
