
// --- STAR COMPONENT ---
const Star = ({ style }) => (
  <div
    className="absolute rounded-full opacity-0 star-twinkle"
    style={style}
  />
);

// --- STAR BACKGROUND COMPONENT ---
export const StarBackground = ({ starCount = 100 }) => {
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    const size = Math.random() * 2 + 0.5; // star size
    const style = {
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 2 + 1}s`,
      backgroundColor: "currentColor", // star will inherit color
    };
    stars.push(<Star key={i} style={style} />);
  }

  // const starKeyframes = "l"
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900 via-indigo-950 to-black text-white">
        {stars}
      </div>
    </>
  );
};
