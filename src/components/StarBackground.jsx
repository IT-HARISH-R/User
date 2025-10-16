import React from "react";

// --- STAR COMPONENT ---
const Star = ({ style }) => (
  <div className="absolute bg-white rounded-full opacity-0 star-twinkle" style={style} />
);

// --- STAR BACKGROUND COMPONENT ---
export const StarBackground = () => {
  const stars = [];
  for (let i = 0; i < 100; i++) {
    const size = Math.random() * 2 + 0.5;
    const style = {
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 2 + 1}s`,
    };
    stars.push(<Star key={i} style={style} />);
  }

  // Keyframes for twinkling effect
  const starKeyframes = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .star-twinkle {
      animation: twinkle infinite alternate ease-in-out;
    }
  `;

  return (
    <>
      <style>{starKeyframes}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars}
      </div>
    </>
  );
};
