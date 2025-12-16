import React, { useEffect, useState } from "react";
import PlanCard from "../components/PlanCard";
import plansServer from "../server/planServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";
import Loading from "../components/Loading";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

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

  const handlePlanUpdated = (updatedPlan) => {
    setPlans((prevPlans) =>
      prevPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  const handlePlanDelete = () => {
    fetchPlans(); // Refresh the list after deletion
  };

  const handleSelectPlan = async (plan) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!plan?.id) return alert("Invalid plan selected");

    try {
      const order = await plansServer.createOrder(plan.id);

      if (!order?.order_id || !order?.amount || !order?.key)
        return alert("Order creation failed. Try again.");

      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        name: "Astro Premium",
        description: plan.name,
        order_id: order.order_id,
        handler: async function (response) {
          try {
            await plansServer.verifyPayment({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              plan_id: plan.id,
            });
            alert("Payment Successful! Plan Activated.");
            navigate("/dashboard");
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: "9999999999",
        },
        theme: { color: "#4f46e5" },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Refresh and try again.");
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Error in handleSelectPlan:", err);
      alert("Something went wrong while processing payment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-black flex items-center justify-center">
        <Loading text="Loading plans..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white">
      <StarBackground />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Unlock premium features and elevate your experience with our flexible subscription plans
            </p>
          </div>

          {/* Single Grid Container with Equal Height Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className={`
              grid gap-8 
              ${plans.length === 1
                ? "grid-cols-1 justify-center max-w-md mx-auto"
                : plans.length === 2
                  ? "grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }
            `}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="h-full flex"
                >
                  <PlanCard
                    plan={plan}
                    onSelect={handleSelectPlan}
                    onUpdated={handlePlanUpdated}
                    onDelete={handlePlanDelete}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                What's Included in All Plans
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Secure Payment Processing</span>
                </div>

              </div>
            </div>

            <p className="text-gray-400 mt-8 text-sm sm:text-base">
              Need help choosing?{" "}
              <button
                onClick={() => navigate("/contact")}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Contact our team
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;