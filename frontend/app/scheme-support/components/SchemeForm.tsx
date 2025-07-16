// frontend/app/scheme-support/components/SchemeForm.tsx

"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";

type Props = {
  onSubmitAction: (formData: any) => void;
};

export default function SchemeForm({ onSubmitAction }: Props) {
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    occupation: "",
    state: "",
    marital_status: "",
    category: "",
    disability: false,
  });

  // Updated handleChange function
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    // Capitalize first letter for occupation and state
    let updatedValue = value;
    if (name === "occupation" || name === "state") {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : updatedValue,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmitAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-pink-700 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pink-700 mb-1">Annual Income (₹)</label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pink-700 mb-1">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
            placeholder="e.g., Student, Homemaker, Farmer"
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pink-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            placeholder="e.g., Karnataka"
            className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-sm font-semibold text-pink-700 mb-1">Marital Status</label>
        <select
          name="marital_status"
          value={formData.marital_status}
          onChange={handleChange}
          required
          className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-pink-700 mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Select Category</option>
          <option value="general">General</option>
          <option value="obc">OBC</option>
          <option value="sc">SC</option>
          <option value="st">ST</option>
        </select>
      </div>

      {/* Disability Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="disability"
          checked={formData.disability}
          onChange={handleChange}
          className="h-4 w-4 text-pink-600 focus:ring-pink-400 border-pink-300 rounded"
        />
        <label className="text-sm text-pink-700">I have a disability</label>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
        >
          <BadgeCheck className="inline mr-1 -mt-1" size={18} />
          Find My Schemes
        </button>
      </div>
    </form>
  );
}
