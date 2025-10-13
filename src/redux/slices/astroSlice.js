import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  predictions: {},  // store predictions by unique key
  lastKey: null,    // remember last used prediction key
};

const astroSlice = createSlice({
  name: "astro",
  initialState,
  reducers: {
    cachePrediction: (state, action) => {
      const { key, data } = action.payload;
      state.predictions[key] = data;
      state.lastKey = key; // store last used prediction key
    },
    clearPredictions: (state) => {
      state.predictions = {};
      state.lastKey = null;
    },
  },
});

export const { cachePrediction, clearPredictions } = astroSlice.actions;
export default astroSlice.reducer;
