import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import today from "../../server/today"; // adjust path if needed
// import TodayPredictions from "../../components/TodayPredictions";

// ✅ Async thunk to fetch daily predictions
export const fetchPredictions = createAsyncThunk(
  "zodiac/fetchPredictions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await today.todatZodiac();
      return res.data; // { date, predictions }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const zodiacSlice = createSlice({
  name: "zodiac",
  initialState: {
    date: null,
    predictions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.date = action.payload.date;
        state.predictions = action.payload.predictions;
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default zodiacSlice.reducer;
