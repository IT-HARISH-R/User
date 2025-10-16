import api from "./axios";

const authServices = {
    // Register api
    Register: async (data) => {
        try {
            console.log("Login Data:", data);
            const res = await api.post("/api/auth/register/", data);
            console.log("Login Response:", res);
            return res;
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    },
    // Login api

    Login: async (data) => {
        try {
            console.log("Login Data:", data);
            const res = await api.post("/api/auth/login/", data);
            console.log("Login Response:", res);
            return res;
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    },

    updateProfile: async (data) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await api.put("api/auth/profile/update/", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Profile Update Response:", res);
            return res;
        } catch (err) {
            console.error("updateProfile error:", err.response?.data || err);
            throw err;
        }
    },


    // Get Profile api
    getProfile: async () => {
        try {
            const token = localStorage.getItem("accessToken")
            // console.log("tok", tok)
            const res = await api.get(`api/auth/profile/`)
            //     , {

            //     headers: { Authorization: `Bearer ${token}` },
            // });
            return res;
        } catch (err) {
            console.error("Get Profile error:", err);
            throw err;
        }
    },
};

export default authServices;
