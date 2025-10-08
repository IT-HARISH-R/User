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
