"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/");
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        setMessage(data.message);
      } catch {
        setMessage("Failed to load data");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#fbeaff] to-[#e0c3fc] min-h-screen text-gray-800 font-sans">
      
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/70 fixed top-0 w-full z-50 shadow-md px-6 md:px-12 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#5C068C]">Sahaya Sakhi</h1>
        <div className="hidden md:flex items-center gap-6">
          <a href="#about" className="hover:text-[#5C068C] font-medium transition">About</a>
          <a href="#features" className="hover:text-[#5C068C] font-medium transition">Features</a>
          <a href="#how" className="hover:text-[#5C068C] font-medium transition">How it Works</a>
          <a href="#start" className="hover:text-[#5C068C] font-medium transition">Get Started</a>
        </div>
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="border border-[#5C068C] text-[#5C068C] px-4 py-1.5 rounded-full hover:bg-[#f3e8ff] font-semibold transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-[#5C068C] text-white px-4 py-1.5 rounded-full hover:bg-[#45045f] font-semibold transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold text-[#5C068C] drop-shadow mb-6"
        >
          Welcome to Sahaya Sakhi!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
        >
          {message}
        </motion.p>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white text-center px-6">
        <h2 className="text-3xl font-bold text-[#5C068C] mb-4">About Sahaya Sakhi</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700">
          Sahaya Sakhi is an AI-powered platform dedicated to empowering women across India
          by recognizing their talents, connecting them with opportunities, providing legal assistance,
          and mapping them to relevant government schemes.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-[#f5ebff] text-center px-6">
        <h2 className="text-3xl font-bold text-[#5C068C] mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard title="Talent Recognition" description="Discover your hidden strengths through intelligent questionnaires." />
          <FeatureCard title="Legal Chatbot" description="Get free, voice-enabled legal advice tailored for Indian women." />
          <FeatureCard title="Scheme Matching" description="Find central and state government schemes you're eligible for." />
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white text-center px-6">
        <h2 className="text-3xl font-bold text-[#5C068C] mb-4">How It Works</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700">
          Register, take a quick talent test, and instantly get personalized career and support recommendations.
          Navigate your path with AI support every step of the way.
        </p>
      </section>

      {/* Get Started */}
      <section id="start" className="py-20 bg-[#e0c3fc] text-center px-6">
        <h2 className="text-3xl font-bold text-[#5C068C] mb-4">Get Started</h2>
        <p className="text-lg mb-6 text-gray-700">Ready to discover your potential and receive the support you deserve?</p>
        <button
          onClick={() => router.push("/register")}
          className="bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold px-10 py-4 rounded-full shadow-lg transition"
        >
          Join Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Sahaya Sakhi. All rights reserved to <span className="font-semibold text-[#5C068C]">Anuhya Mattaparthi</span>.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-[#5C068C] transition duration-300"
    >
      <h3 className="text-xl font-bold text-[#5C068C] mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
}
