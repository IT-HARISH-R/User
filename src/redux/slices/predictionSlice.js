// src/store/slices/predictionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: {
    futurePrediction: null,
    loading: false,
    error: null,
    lastFetched: null, // timestamp to track freshness
  },
  reducers: {
    setPrediction: (state, action) => {
      state.futurePrediction = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPrediction: (state) => {
      state.futurePrediction = null;
      state.lastFetched = null;
    },
  },
});

export const { setPrediction, setLoading, setError, clearPrediction } = predictionSlice.actions;
export default predictionSlice.reducer;