import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { fetchPredictions } from "../redux/slices/zodiacSlice";

const TodayPredictions = () => {
  const dispatch = useDispatch();

  // ✅ Access data from Redux store
  const { date, predictions, loading, error } = useSelector(
    (state) => state.zodiac
  );

  // ✅ Fetch once when component mounts
  useEffect(() => {
    dispatch(fetchPredictions());
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🌞 Today’s Zodiac Predictions ({date})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.length > 0 ? (
          predictions.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold capitalize text-indigo-600 mb-2">
                {item.sign}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {item.prediction_text}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-3">
            No predictions found for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default TodayPredictions;
