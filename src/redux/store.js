import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import astroReducer from "./slices/astroSlice";

// 🔹 Load only astrology state from localStorage
const loadAstroState = () => {
  try {
    // const saved = localStorage.getItem("astroState");
    const saved = null;
    return saved ? { astro: JSON.parse(saved) } : undefined;
  } catch (e) {
    console.error("Failed to load astro state", e);
    return undefined;
  }
};

// 🔹 Save only astrology state to localStorage
const saveAstroState = (state) => {
  try {
    // localStorage.setItem("astroState", JSON.stringify(state.astro));
  } catch (e) {
    console.error("Failed to save astro state", e);
  }
};

// 🔹 Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    astro: astroReducer,
  },
  preloadedState: loadAstroState(),
});

// 🔹 Persist astro state on every change
store.subscribe(() => {
  saveAstroState(store.getState());
});
