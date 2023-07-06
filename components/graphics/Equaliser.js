import React from 'react';

/**
 * Renders a moving equiliser next to the track which is playing
 * @function Equaliser
 * @returns {JSX}
 */
function Equaliser() {
  return (
    <div className="grid gap-[1px] grid-cols-5 w-3.5 h-3.5">
      <div className="bg-green-500 scale-y-[0.3] origin-bottom md:animate-equalise"></div>
      <div className="bg-green-500 scale-y-[0.55] origin-bottom md:animate-equalise md:animation-delay-500"></div>
      <div className="bg-green-500 scale-y-[0.81] origin-bottom md:animate-equalise md:animation-delay-1100"></div>
      <div className="bg-green-500 scale-y-[0.4] origin-bottom md:animate-equalise md:animation-delay-800"></div>
      <div className="bg-green-500 scale-y-[0.8] origin-bottom md:animate-equalise md:animation-delay-1000"></div>
    </div>
  );
}

export default Equaliser;

