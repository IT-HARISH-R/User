import React, { useState } from "react";
import plansServer from "../server/planServices";
import { useSelector } from "react-redux";

const PlanCard = ({ plan, onSelect, onUpdated ,onDelete}) => {
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

  // 🟣 Add new feature
  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  // 🟣 Enter key adds a feature
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  // 🟣 Remove a feature
  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // 🟢 Update existing plan
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

  // 🔴 Delete plan
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    setLoading(true);
    try {
      await plansServer.deletePlan(plan.id);
      alert("Plan deleted successfully!");
      if (onDelete) onDelete(); // Refresh the plan list
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative rounded-2xl p-6 sm:p-8
        ring-1 ring-white/10 hover:ring-indigo-400
        transition cursor-pointer
        flex flex-col justify-between
        min-h-[400px] sm:min-h-[450px] md:min-h-[500px] bg-white/10
      "
    >
      {!isEditing ? (
        <>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-400 text-center sm:text-left">
              {plan.name}
            </h3>

            <p className="mt-4 flex items-baseline justify-center sm:justify-start gap-x-2">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                ₹{plan.price}
              </span>
              <span className="text-sm sm:text-base text-gray-400">
                /{plan.plan_type}
              </span>
            </p>

            <p className="mt-4 text-sm sm:text-base text-gray-300 text-center sm:text-left">
              {plan.description}
            </p>

            <ul className="mt-6 space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex gap-x-2 items-center">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 sm:h-5 sm:w-5 flex-none text-indigo-400"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 rounded-md bg-indigo-500 px-4 py-2 sm:py-3 text-center text-sm font-semibold text-white hover:bg-indigo-400"
              onClick={() => onSelect(plan)}
            >
              Get started
            </button>

            {/* 🧠 Admin buttons */}
            {user && user.role === "admin" && (
              <>
                <button
                  className="flex-1 rounded-md bg-gray-600 px-4 py-2 sm:py-3 text-center text-sm font-semibold text-white hover:bg-gray-500"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 sm:py-3 text-center text-sm font-semibold text-white hover:bg-red-500"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {error && <p className="text-red-400 font-semibold">{error}</p>}

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
              placeholder="Plan name"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
              placeholder="Price"
            />
          </div>

          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one_time">One-Time</option>
          </select>

          {/* Feature Add/Remove Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Features
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center bg-indigo-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    className="ml-2 text-white hover:text-gray-200"
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
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                placeholder="Type feature and press Enter"
              />
              <button
                onClick={handleAddFeature}
                className="bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-400"
              >
                Add
              </button>
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Description"
            rows={3}
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              className="flex-1 rounded-md bg-green-500 px-4 py-2 sm:py-3 text-white hover:bg-green-400"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save"}
            </button>
            <button
              className="flex-1 rounded-md bg-red-500 px-4 py-2 sm:py-3 text-white hover:bg-red-400"
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
