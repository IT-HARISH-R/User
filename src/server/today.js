import api from "./axios";

const today = {

  todatZodiac: async () => {
    try {
      const res = await api.get("zodiac/today/");
      console.log("get Today Zodiac", res)
      return res;
    } catch (err) {
      console.error("Error fetching Today Zodiac:", err);
      throw err;
    }
  },


};

export default today;
