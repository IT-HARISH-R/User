import api from "./axios";  


const astroServices = {
  getPrediction: async (data) => {
    try {
      const res = await api.post("data/compute/", data);
      return res.data;
    } catch (err) {
      console.error("Astro API error:", err.response?.data || err.message);
      throw err;
    }
  },
};

export default astroServices;
