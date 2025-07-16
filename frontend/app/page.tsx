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
    <div className="bg-gradient-to-br from-[#fbeaff] to-[#e0c3fc] min-h-screen text-gray-800">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-md fixed top-0 w-full z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-[#5C068C]">Sahaya Sakhi</h1>
          <div className="space-x-6 hidden md:flex">
            <a href="#about" className="hover:text-[#5C068C] font-medium">About</a>
            <a href="#features" className="hover:text-[#5C068C] font-medium">Features</a>
            <a href="#how" className="hover:text-[#5C068C] font-medium">How it Works</a>
            <a href="#start" className="hover:text-[#5C068C] font-medium">Get Started</a>
          </div>
        </div>

        <div className="space-x-4 hidden md:flex">
          <button
            onClick={() => router.push("/login")}
            className="bg-white hover:bg-[#f3e8ff] text-[#5C068C] font-semibold border border-[#5C068C] px-4 py-2 rounded-full transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold px-4 py-2 rounded-full transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-15 text-center flex flex-col items-center justify-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-5xl md:text-6xl font-extrabold text-[#5C068C] drop-shadow mb-5"
        >
          Welcome to Sahaya Sakhi!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-lg md:text-xl text-gray-700 max-w-2xl"
        >
          {message}
        </motion.p>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 mt-6 text-[#5C068C]">About Sahaya Sakhi</h2>
        <p className="max-w-3xl mx-auto text-lg">
          Sahaya Sakhi is an AI-powered platform dedicated to empowering women across India
          by recognizing their talents, connecting them with opportunities, providing legal assistance,
          and mapping them to relevant government schemes.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 text-center bg-[#f5ebff]">
        <h2 className="text-3xl font-bold mb-10 mt-6 text-[#5C068C]">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard title="Talent Recognition" description="Discover your hidden strengths through intelligent questionnaires." />
          <FeatureCard title="Legal Chatbot" description="Get free, voice-enabled legal advice tailored for Indian women." />
          <FeatureCard title="Scheme Matching" description="Find central and state government schemes you're eligible for." />
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#5C068C]">How It Works</h2>
        <p className="max-w-3xl mx-auto text-lg mb-8">
          Register, take a quick talent test, and instantly get personalized career and support recommendations.
          Navigate your path with AI support every step of the way.
        </p>
      </section>

      {/* Get Started */}
      <section id="start" className="py-15 bg-[#e0c3fc] text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#5C068C]">Get Started</h2>
        <p className="mb-6 text-lg">Ready to discover your potential and receive the support you deserve?</p>
        <button
          onClick={() => router.push("/register")}
          className="bg-[#5C068C] hover:bg-[#45045f] text-white font-semibold px-10 py-4 rounded-full shadow-lg transition"
        >
          Join Now
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-md p-6 border border-[#5C068C] transition"
    >
      <h3 className="text-xl font-bold text-[#5C068C] mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
}
