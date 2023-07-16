import React, { useEffect, useState } from 'react';
// import functions
import { capitalize } from '@/lib/capitalize';

/**
 * Renders genre title in sticky Banner
 * @function GenreHeading
 * @param {object} heading genre title
 * @param {object} scrollRef ref for container scroll
 * @returns {JSX}
 */
function GenreHeading({ heading, scrollRef }) {
  // show title when  at top of screen
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollRef.current.scrollTop;
      setIsVisible(scrollPosition > 250);

      const maxScroll = 185;
      const opacityValue = Math.min(scrollPosition / maxScroll, 1);
      setOpacity(opacityValue);
    };

    handleScroll(); // Run initially to set the text visibility

    const scrollContainer = scrollRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  return (
    <>
      <div className="absolute top-0 w-full z-20">
        <div className=" h-20 bg-black" style={{ opacity }}>
          <div
            className={` ${
              isVisible ? 'opacity-100' : 'opacity-0'
            } py-4 transition delay-100 duration-300 ease-in-out flex items-center overflow-hidden  `}
          >
            <span className="ml-5 isSm:ml-28 drop-shadow-text text-white text-3xl font-bold p-2 truncate pr-[100px] md:pr-[250px]">
              {capitalize(heading)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default GenreHeading;
