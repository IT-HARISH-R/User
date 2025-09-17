import api from "../axios"

const authServices = {
    Login: async (data) => {
        try {
            console.log(data)
            const res = await api.post('/api/auth/login/', data)
            console.log(res)
            return res
        }
        catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    }
}

export default authServices