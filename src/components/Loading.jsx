import React from "react";
import { StarBackground } from "./StarBackground";

const Loading = ({ text = "Loading...", height = "100vh"}) => {
    return (
        <div
            className="relative flex flex-col items-center justify-center w-full h-[10066px] bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white"
            style={{ height }}
        >
            {/* Star background behind spinner */}
            <StarBackground />

            {/* Spinner */}
            <div className="relative z-10 w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Loading text */}
            <p className="relative z-10 text-lg sm:text-xl font-semibold text-white/90 animate-pulse mt-4">
                {text}
            </p>
        </div>
    );
};

export default Loading;
