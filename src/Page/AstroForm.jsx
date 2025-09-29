import React, { useState } from "react";
import astroServices from "../server/astroServices";

const AstroForm = () => {
    const [formData, setFormData] = useState({
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        model: "gemini-2.5-flash",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await astroServices.getPrediction(formData);
            setResult(res);
        } catch (err) {
            setError("Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-indigo-900 to-black p-6 text-white">
            <div className="bg-black/70 p-8 rounded-2xl border border-indigo-600/30 shadow-2xl w-full max-w-md backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-6 text-center">🔮 Astrology Prediction</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            name="year"
                            placeholder="Year"
                            value={formData.year}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <input
                            type="number"
                            name="month"
                            placeholder="Month"
                            value={formData.month}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <input
                            type="number"
                            name="day"
                            placeholder="Day"
                            value={formData.day}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <input
                            type="number"
                            name="hour"
                            placeholder="Hour"
                            value={formData.hour}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <input
                            type="number"
                            name="minute"
                            placeholder="Minute"
                            value={formData.minute}
                            onChange={handleChange}
                            className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold transition-colors"
                    >
                        {loading ? "Loading..." : "Get Prediction"}
                    </button>
                </form>

                {/* Results */}
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {result && (
                    <div className="mt-6 space-y-3">
                        <h3 className="text-lg font-semibold text-indigo-300">Prediction:</h3>
                        <p className="text-indigo-100 whitespace-pre-line">
                            {result.thanglish_explanation}
                        </p>
                        <div className="mt-4 text-sm text-gray-400">
                            <p>Julian Day: {result.astrology_data.julian_day}</p>
                            <p>☀ Sun Longitude: {result.astrology_data.sun_longitude}</p>
                            <p>🌙 Moon Longitude: {result.astrology_data.moon_longitude}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AstroForm;
