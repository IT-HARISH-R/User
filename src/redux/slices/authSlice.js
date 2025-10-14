import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("profile");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      // localStorage.setItem("profile", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      // localStorage.removeItem("profile");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    UpdateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }; 
    },
  },
});

export const { login, logout, UpdateUser } = authSlice.actions;
export default authSlice.reducer;
