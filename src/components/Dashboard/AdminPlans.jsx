import React, { useEffect, useState } from "react";
import plansServer from "../../server/planServices";
import {
  Loader2, Pencil, Trash2, PlusCircle,
  X, Check, Tag, CreditCard, Calendar
} from "lucide-react";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    plan_type: "monthly",
    price: "",
    description: "",
    features: [],
  });
  const [featureInput, setFeatureInput] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [error, setError] = useState("");

  // 🟢 Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await plansServer.getPlans();
      setPlans(res.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Failed to load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ➕ Add a feature
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !formData.features.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, trimmed],
      }));
      setFeatureInput("");
    }
  };

  // Handle Enter key for adding features
  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
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
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Allow only positive numbers
      if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 🧠 Handle Edit
  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setFormData({
      name: plan.name || "",
      plan_type: plan.plan_type || "monthly",
      price: plan.price?.toString() || "",
      description: plan.description || "",
      features: plan.features || [],
    });
    setMessage({ text: "", type: "" });
    setError("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPlan(null);
    resetForm();
  };

  // 🗑️ Handle Delete
  const handleDelete = async (id) => {
    const planName = plans.find(p => p.id === id)?.name;
    
    if (!window.confirm(`Are you sure you want to delete "${planName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await plansServer.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      setMessage({
        text: `Plan "${planName}" deleted successfully!`,
        type: "success"
      });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (err) {
      console.error(err);
      setMessage({
        text: "Failed to delete plan!",
        type: "error"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      plan_type: "monthly",
      price: "",
      description: "",
      features: [],
    });
    setFeatureInput("");
    setError("");
  };

  // 💾 Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: "", type: "" });
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Plan name is required!");
      setSubmitting(false);
      return;
    }
    
    if (!formData.price || parseInt(formData.price) <= 0) {
      setError("Please enter a valid price!");
      setSubmitting(false);
      return;
    }

    try {
      if (editingPlan) {
        // Update plan
        const res = await plansServer.updatePlan(editingPlan, {
          name: formData.name.trim(),
          plan_type: formData.plan_type,
          price: parseInt(formData.price),
          description: formData.description.trim(),
          features: formData.features,
        });
        
        setPlans((prev) =>
          prev.map((p) => (p.id === editingPlan ? res.data : p))
        );
        
        setMessage({
          text: `✅ Plan "${res.data.name}" updated successfully!`,
          type: "success"
        });
      } else {
        // Create plan
        const res = await plansServer.createPlans({
          name: formData.name.trim(),
          plan_type: formData.plan_type,
          price: parseInt(formData.price),
          description: formData.description.trim(),
          features: formData.features,
        });
        
        setPlans((prev) => [...prev, res.data]);
        setMessage({
          text: `✅ Plan "${res.data.name}" created successfully!`,
          type: "success"
        });
      }

      // Reset form
      handleCancelEdit();
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      "Something went wrong. Please try again.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Get plan type icon
  const getPlanTypeIcon = (type) => {
    switch(type) {
      case 'monthly': return <Calendar className="h-4 w-4" />;
      case 'yearly': return <Calendar className="h-4 w-4" />;
      case 'one_time': return <CreditCard className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  // Get plan type label
  const getPlanTypeLabel = (type) => {
    switch(type) {
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      case 'one_time': return 'One-Time';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-500 mx-auto" size={48} />
          <p className="mt-4 text-gray-300 text-lg">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Subscription Plans Management
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Create, edit, and manage subscription plans for your astrology platform
          </p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-900/30 border-green-500/30 text-green-300' 
              : 'bg-red-900/30 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center justify-center">
              {message.type === 'success' ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <X className="h-5 w-5 mr-2" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Current Plans</h2>
            <div className="text-sm text-gray-400">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-700/50">
              <Tag className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Plans Found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Create your first subscription plan to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="group bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 
                           hover:border-indigo-500/50 hover:bg-gray-800/60 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {plan.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 px-3 py-1 bg-indigo-900/40 text-indigo-300 rounded-full text-sm">
                          {getPlanTypeIcon(plan.plan_type)}
                          {getPlanTypeLabel(plan.plan_type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 bg-gray-700/50 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        aria-label={`Edit ${plan.name} plan`}
                      >
                        <Pencil size={18} className="text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 bg-gray-700/50 hover:bg-red-500/20 rounded-lg transition-colors"
                        aria-label={`Delete ${plan.name} plan`}
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {plan.description || "No description provided."}
                  </p>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white mb-1">
                      ₹{plan.price?.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        / {plan.plan_type === 'one_time' ? 'once' : plan.plan_type}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Features</h4>
                    <ul className="space-y-2">
                      {plan.features?.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                      {(!plan.features || plan.features.length === 0) && (
                        <li className="text-gray-500 text-sm italic">No features listed</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {editingPlan ? (
                  <>
                    <Pencil className="text-yellow-400" size={24} />
                    Edit Plan
                  </>
                ) : (
                  <>
                    <PlusCircle className="text-indigo-400" size={24} />
                    Create New Plan
                  </>
                )}
              </h2>
              
              {editingPlan && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Premium Plan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Type
                  </label>
                  <select
                    name="plan_type"
                    value={formData.plan_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                             text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 
                             focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one_time">One-Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (INR) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">₹</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-indigo-500 focus:border-transparent"
                    placeholder="999"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter amount in Indian Rupees
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                           focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe what this plan offers..."
                  rows={3}
                />
              </div>

              {/* Features Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Features
                </label>
                
                {/* Added Features */}
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-indigo-900/50 text-indigo-300 
                                 px-3 py-1.5 rounded-full text-sm"
                      >
                        <Check className="h-3 w-3" />
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(i)}
                          className="ml-2 text-gray-400 hover:text-white transition-colors"
                          aria-label={`Remove ${feature}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Feature Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={handleFeatureKeyPress}
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a feature (press Enter to add)"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    disabled={!featureInput.trim()}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 
                             disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Add key features that customers will get with this plan
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 
                           hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 
                           disabled:cursor-not-allowed rounded-lg font-bold text-lg 
                           transition-all duration-300 flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      {editingPlan ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingPlan ? "Update Plan" : "Create New Plan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;