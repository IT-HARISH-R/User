import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";

const AstroHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  console.log(user)
  // Format ISO date string to professional format
  const formatCreatedAt = (isoString) => {
    const date = new Date(isoString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const predictionsArray = user?.predictions || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden p-4 bg-gradient-to-b from-gray-900 via-indigo-950 to-black pt-20">
      <StarBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-3xl space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-300">Prediction History</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold shadow-md"
          >
            Back
          </button>
        </div>

        {predictionsArray.length === 0 ? (
          <p className="text-gray-400 text-center">No history yet.</p>
        ) : (
          <ul className="space-y-6">
            {predictionsArray.map((data) => {
              const displayTime = formatCreatedAt(data.created_at);

              // Check if this prediction has birth info
              const hasBirthInfo =
                data.birth_day !== null &&
                data.birth_month !== null &&
                data.birth_year !== null &&
                data.birth_hour !== null &&
                data.birth_minute !== null;

              return (
                <li
                  key={data.id}
                  className="p-4 bg-gray-800/60 rounded-xl border border-gray-700/50"
                >
                  {/* Birth Info (only if present) */}
                  {hasBirthInfo && (
                    <div className="mb-3 p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                      <h3 className="text-indigo-200 font-semibold mb-1">Your Birth Info</h3>
                      <p className="text-gray-300 font-mono text-sm">
                        {`Date: ${data.birth_year}-${String(data.birth_month).padStart(2, "0")}-${String(data.birth_day).padStart(2, "0")}`}
                      </p>
                      <p className="text-gray-300 font-mono text-sm">
                        {`Time: ${String(data.birth_hour).padStart(2, "0")}:${String(data.birth_minute).padStart(2, "0")} (24-hour format)`}

                      </p>
                      <p className="text-gray-300 font-mono text-sm">
                        {`julian_day: ${String(data.julian_day)}`}

                      </p>
                      <p className="text-gray-300 font-mono text-sm">
                        {`moon_longitude: ${String(data.moon_longitude)}`}

                      </p>
                      <p className="text-gray-300 font-mono text-sm">
                        {`sun_longitude: ${String(data.sun_longitude)}`}

                      </p>
                    </div>
                  )}

                  {/* Prediction Time */}
                  <p className="text-gray-300 font-mono text-sm mb-2">{displayTime}</p>

                  {/* Prediction Text */}
                  <p
                    className="text-indigo-100 whitespace-pre-line leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{
                      __html: data.thanglish_explanation.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default AstroHistory;
