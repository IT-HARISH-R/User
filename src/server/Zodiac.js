import api from "./axios";

const Zodiac = {

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

  LoveMatch: async (data) => {
    try {
      const res = await api.post("zodiac/love/",data);
      console.log("get love ", res)
      return res;
    } catch (err) {
      console.error("Error fetching love:", err);
      throw err;
    }
  },

};

export default Zodiac;
