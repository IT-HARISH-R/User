import api from "./axios";

const plansServer = {
  // 🔹 Fetch all available plans
  getPlans: async () => {
    try {
      const res = await api.get("/plans/list/");
      console.log("get Plans", res)
      return res;
    } catch (err) {
      console.error("❌ Error fetching plans:", err);
      throw err;
    }
  },

  // 🔹 Create a new plan (admin-only, optional)
  createPlans: async (planData) => {
    try {
      const res = await api.post("/plans/list/", planData, {
        withCredentials: true, // include cookies if JWT auth
      });
      return res;
    } catch (err) {
      console.error("❌ Error creating plan:", err);
      throw err;
    }
  },

  // 🔹 Create Razorpay order (requires authentication)
  createOrder: async (planId) => {
    try {
      const res = await api.post(
        "/plans/create-order/",
        { plan_id: planId },
        { withCredentials: true }
      );
      console.log("✅ Order created:", res.data);
      return res.data; // return clean JSON (key, order_id, amount)
    } catch (err) {
      console.error("❌ Error creating order:", err.response?.data || err);
      throw err;
    }
  },

  // 🔹 Verify Razorpay payment
  verifyPayment: async (paymentData) => {
    try {
      console.log("🧾 Verifying payment:", paymentData);
      const res = await api.post("/plans/verify-payment/", paymentData, {
        withCredentials: true,
      });
      console.log("✅ Payment verification successful:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Error verifying payment:", err.response?.data || err);
      throw err;
    }
  },

  updatePlan: async (id, data) => {
    try {
      const res = await api.patch(`/plans/plan/${id}/`, data, {
        withCredentials: true,
      });
      console.log("✅ update Plan successful:", res.data);
      return res;
    } catch (err) {
      console.error("❌ update Plan:", err.response?.data || err);
      throw err;
    }
  },
  deletePlan: async (id, data) => {
    try {
      const res = await api.delete(`/plans/plan/${id}/`,);
      console.log("✅ delete Plan successful:", res.data);
      return res;
    } catch (err) {
      console.error("❌ delete Plan:", err.response?.data || err);
      throw err;
    }
  },
};

export default plansServer;
