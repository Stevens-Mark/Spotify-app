import React from 'react';

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


// function Equaliser() {
//   const delays = [
//     'animate-equalise-75',
//     'animation-delay-100',
//     'animation-delay-200',
//     'animation-delay-500',
//     'animation-delay-700',
//     'animation-delay-800',
//     'animation-delay-900',
//     'animation-delay-1000',
//     'animation-delay-1100',
//   ];

//   const bars = [];
//   for (let i = 1; i <= 5; i++) {
//     bars.push(
//       <div
//         className={`bg-green-500 origin-bottom animate-equalise ${
//           delays[Math.floor(Math.random() * 9)]
//         }`}
//       ></div>
//     );
//   }
//   return <div className="grid gap-[1px] grid-cols-5 w-3.5 h-3.5 ">{bars}</div>;
// }
// export default Equaliser;
