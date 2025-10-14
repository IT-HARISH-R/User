import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  predictions: {},  
  lastKey: null,    
};

const astroSlice = createSlice({
  name: "astro",
  initialState,
  reducers: {
    cachePrediction: (state, action) => {
      const { key, data } = action.payload;
      state.predictions[key] = data;
      state.lastKey = key;
    },
    clearPredictions: (state) => {
      state.predictions = {};
      state.lastKey = null;
    },
  },
});

export const { cachePrediction, clearPredictions } = astroSlice.actions;
export default astroSlice.reducer;
