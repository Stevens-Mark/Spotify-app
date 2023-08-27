import React, { useEffect, useState } from 'react';
// import functions
import { capitalize } from '@/lib/capitalize';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';

/**
 * Renders discography sticky Quick Player Banner
 * @function DiscographyQuickPlayBanner
 * @param {string} title of album
 * @param {boolean} activeStatus playing or not
 * @param {function} handleClick play or pause track
 * @returns {JSX}
 */
function DiscographyQuickPlayBanner({ title, activeStatus, handleClick }) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full z-[25] h-20">
        <div
          className={`py-4 transition delay-100 duration-300 ease-in-out flex items-center overflow-hidden `}
        >
          <button
            className={`ml-20 isSm:ml-28 bg-gray-900 border-2 border-green-500 rounded-full text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-95`}
            onClick={(event) => {
              handleClick(event);
            }}
            aria-label="Play or Pause"
          >
            {activeStatus ? (
              <PauseCircleIcon className="w-8 h-8 xs:w-12 xs:h-12" />
            ) : (
              <PlayCircleIcon className="w-8 h-8 xs:w-12 xs:h-12" />
            )}
          </button>
          <h2 className="text-white text-xl font-bold p-2 truncate pr-[67px] isMdLg:pr-[250px]">
            {capitalize(title)}
          </h2>
        </div>
      </div>
    </>
  );
}

export default DiscographyQuickPlayBanner;
