import React, { useState } from "react";
import plansServer from "../server/planServices";
import { useSelector } from "react-redux";

const PlanCard = ({ plan, onSelect, onUpdated, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState(plan.price);
  const [planType, setPlanType] = useState(plan.plan_type);
  const [description, setDescription] = useState(plan.description);
  const [features, setFeatures] = useState(plan.features || []);
  const [newFeature, setNewFeature] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!name || !price) {
      setError("Plan name and price are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedPlan = await plansServer.updatePlan(plan.id, {
        name,
        price: parseInt(price),
        plan_type: planType,
        description,
        features,
      });

      if (onUpdated) onUpdated(updatedPlan.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to update plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    setLoading(true);
    try {
      await plansServer.deletePlan(plan.id);
      alert("Plan deleted successfully!");
      if (onDelete) onDelete();
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        relative rounded-2xl p-6
        border border-white/10 hover:border-indigo-400/50
        transition-all duration-300 cursor-pointer
        flex flex-col justify-between
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-sm
        w-full
        ${isEditing ? "max-w-2xl mx-auto" : ""}
      `}
    >
      {!isEditing ? (
        <>
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 text-center">
              {plan.name}
            </h3>

            <p className="mt-6 flex items-baseline justify-center gap-x-1">
              <span className="text-4xl md:text-5xl font-bold text-white">
                ₹{plan.price}
              </span>
              <span className="text-sm text-gray-400">
                /{plan.plan_type.replace("_", "-")}
              </span>
            </p>

            <p className="mt-4 text-center text-gray-300 text-sm md:text-base">
              {plan.description}
            </p>

            <ul className="mt-8 space-y-3 text-gray-300">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex gap-x-3 items-start">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 flex-none text-indigo-400 mt-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    />
                  </svg>
                  <span className="text-sm md:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200"
              onClick={() => onSelect(plan)}
            >
              Get started
            </button>

            {/* Admin buttons */}
            {user && user.role === "admin" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 rounded-lg bg-red-600/90 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-red-500 transition-colors duration-200"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 font-semibold text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plan Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                placeholder="Plan name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                placeholder="Price"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plan Type
            </label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One-Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Features
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm"
                >
                  {feature}
                  <button
                    className="ml-2 text-indigo-300 hover:text-white transition-colors"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 text-white border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                placeholder="Type feature and press Enter"
              />
              <button
                onClick={handleAddFeature}
                className="bg-indigo-600 px-4 py-2.5 rounded-lg text-white hover:bg-indigo-500 transition-colors duration-200 whitespace-nowrap"
              >
                Add Feature
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white border border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition resize-none"
              placeholder="Description"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-white font-medium hover:bg-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-white font-medium hover:bg-gray-600 transition-colors duration-200"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCard;