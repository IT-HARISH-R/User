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

  const handlePlanDelete = (deletedId) => {
    if (deletedId) {
      setPlans((prev) => prev.filter((p) => p.id !== deletedId));
    } else {
      fetchPlans();
    }
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
            navigate("/");
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
        theme: { color: "#2563eb" },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Refresh and try again.");
        return;
      }

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Error in handleSelectPlan:", err);
      alert("Something went wrong while processing payment.");
    }
  };

  if (loading) return <Loading text="Loading plans..." />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white flex items-center justify-center">
      <StarBackground />
      <div className="container mx-auto py-10 relative z-10">
        <h1 className="text-3xl font-bold mb-10 text-center text-white">
          Choose Your Plan
        </h1>

        <div
          className={`grid gap-6 ${
            plans.length === 1
              ? "grid-cols-1 justify-items-center"
              : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelectPlan}
              onUpdated={handlePlanUpdated}
              onDelete={handlePlanDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;
