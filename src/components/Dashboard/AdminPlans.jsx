import React, { useEffect, useState } from "react";
import plansServer from "../../server/planServices";
import { Loader2, Pencil, Trash2, PlusCircle } from "lucide-react";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    plan_type: "monthly",
    price: "",
    description: "",
    features: [],
  });
  const [featureInput, setFeatureInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🟢 Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await plansServer.getPlans();
      setPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ➕ Add a feature
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  // ❌ Remove feature
  const handleRemoveFeature = (i) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== i),
    }));
  };

  // ✏️ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧠 Handle Edit
  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setFormData({
      name: plan.name,
      plan_type: plan.plan_type,
      price: plan.price,
      description: plan.description,
      features: plan.features,
    });
  };

  // 🗑️ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await plansServer.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      alert("Plan deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan!");
    }
  };

  // 💾 Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.name || !formData.price) {
      setError("Plan name and price are required!");
      return;
    }

    try {
      if (editingPlan) {
        // Update plan
        const res = await plansServer.updatePlan(editingPlan, {
          name: formData.name,
          plan_type: formData.plan_type,
          price: parseInt(formData.price),
          description: formData.description,
          features: formData.features,
        });
        setPlans((prev) =>
          prev.map((p) => (p.id === editingPlan ? res.data : p))
        );
        setMessage(`✅ Plan "${res.data.name}" updated successfully!`);
      } else {
        // Create plan
        const res = await plansServer.createPlans({
          name: formData.name,
          plan_type: formData.plan_type,
          price: parseInt(formData.price),
          description: formData.description,
          features: formData.features,
        });
        setPlans((prev) => [...prev, res.data]);
        setMessage(`✅ Plan "${res.data.name}" created successfully!`);
      }

      setEditingPlan(null);
      setFormData({
        name: "",
        plan_type: "monthly",
        price: "",
        description: "",
        features: [],
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-white overflow-hidden">

      <div className="container mx-auto py-12 px-4 relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-10">Admin Plans Dashboard</h1>

        {/* Success / Error messages */}
        {message && (
          <p className="text-center text-green-400 font-semibold mb-4">{message}</p>
        )}
        {error && (
          <p className="text-center text-red-400 font-semibold mb-4">{error}</p>
        )}

        {/* 🟣 Plans List Section */}
        <div
          className={`grid gap-6 mb-16 justify-center ${plans.length === 1
              ? "grid-cols-1 place-items-center" // Single plan centered
              : plans.length === 2
                ? "sm:grid-cols-2 justify-items-center" // Two plans side by side
                : "md:grid-cols-2 xl:grid-cols-3" // Default layout for 3 or more
            }`}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:ring-2 hover:ring-indigo-400 transition-all duration-300 w-full sm:w-80"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-indigo-400">{plan.name}</h2>
                <div className="flex gap-3">
                  <button
                    className="hover:text-yellow-400 transition"
                    onClick={() => handleEdit(plan)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    className="hover:text-red-500 transition"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 mb-2">{plan.description}</p>
              <p className="text-lg font-semibold text-white mb-2">
                ₹{plan.price} / {plan.plan_type}
              </p>

              <ul className="text-gray-400 text-sm list-disc pl-5 space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* 🟢 Create / Edit Form */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md ring-1 ring-white/10 hover:ring-indigo-400 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <PlusCircle className="text-indigo-400" />{" "}
            {editingPlan ? "Edit Plan" : "Create New Plan"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Plan Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="e.g., Premium"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Plan Type</label>
              <select
                name="plan_type"
                value={formData.plan_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One-Time</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Price (INR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="999"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block mb-1 font-medium">Features</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.features.map((feat, i) => (
                  <span
                    key={i}
                    className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {feat}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="ml-2 text-white hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                  placeholder="Add feature..."
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="Describe this plan..."
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold"
            >
              {editingPlan ? "Update Plan" : "Create Plan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
