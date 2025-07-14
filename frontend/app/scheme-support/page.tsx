// frontend/app/scheme-support/page.tsx

"use client";

import { useState } from "react";
import SchemeForm from "./components/SchemeForm";
import SchemeResults from "./components/SchemeResults";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from '@/components/button'

export default function SchemeSupportPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/schemes/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setSchemes(data.schemes || []);

      if (data.schemes?.length) {
        toast.success("Schemes fetched successfully!");
      } else {
        toast("No eligible schemes found. Try different info!", {
          icon: "ℹ️",
        });
      }
    } catch (err) {
      console.error("Error fetching schemes:", err);
      toast.error("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Home Button – Fixed at top-right */}
      <Button
        onClick={() => window.location.href = '/user-dashboard'}
        className="fixed top-4 right-4 bg-purple-500 text-white hover:bg-purple-600 px-4 py-2 text-sm rounded-full shadow-md transition-all z-50"
      >
        Home
      </Button>
  
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-pink-50 to-white shadow-xl rounded-3xl border border-pink-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-pink-500" />
          <h1 className="text-3xl sm:text-3xl font-black text-pink-700 tracking-tight">
            Sahaya Sakhi – Scheme Recommender
          </h1>
        </div>
  
        <p className="mb-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          Empowering women with the knowledge of government schemes they deserve.
          Fill in your details below to find the central and state support available for you.
        </p>
  
        <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
          <h2 className="text-xl font-bold text-pink-600 mb-4">Tell us about yourself 💁‍♀️</h2>
          <SchemeForm onSubmitAction={handleFormSubmit} />
        </div>
  
        {loading ? (
          <p className="mt-6 text-center text-pink-500 animate-pulse text-lg font-semibold">
            🔍 Searching for eligible schemes...
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <SchemeResults schemes={schemes} />
          </motion.div>
        )}
      </motion.div>
    </>
  );
}