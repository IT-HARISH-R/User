import React, { useState } from "react";
import plansServer from "../server/planServices";
import { StarBackground } from "../components/StarBackground";

const AdminPlans = () => {
  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("monthly");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ➕ Add a feature to the list
  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  // ❌ Remove a feature
  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name || !price) {
      setError("Plan name and price are required!");
      return;
    }

    try {
      const res = await plansServer.createPlans({
        name,
        plan_type: planType,
        price: parseInt(price),
        description,
        features,
      });

      setMessage(`✅ Plan "${res.data.name}" added successfully!`);
      setName("");
      setPlanType("monthly");
      setPrice("");
      setDescription("");
      setFeatures([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong. Try again!");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white overflow-hidden">
      <StarBackground />

      <div className="container mx-auto py-20 relative z-10 px-1 md:px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">
          Add New Plan
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white/5 ring-1 transition cursor-pointer ring-white/10 hover:ring-indigo-400 bg-opacity-80 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
        >
          {message && (
            <p className="text-center mb-4 text-green-400 font-semibold">{message}</p>
          )}
          {error && (
            <p className="text-center mb-4 text-red-400 font-semibold">{error}</p>
          )}

          {/* Plan Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Plan Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Premium"
              required
            />
          </div>

          {/* Plan Type */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Plan Type</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One-Time</option>
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Price (INR)</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 999"
              required
            />
          </div>

          {/* Features Input with Add Button */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Features</label>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g., 25 products, 24-hour support"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Add
              </button>
            </div>

            {/* Display added features */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description about the plan..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all duration-300"
          >
            Add Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPlans;
