import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import component/icons
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

/**
 * Renders the 4 songs next to top result
 * @function TopSongCard
 * @param {object} song information
 * @returns {JSX}
 */
const TopSongCard = ({
  HandleTrackPlayPauseClick,
  order,
  activeStatus,
  song,
}) => {
  const mainDivRef = useRef(null);
  const handleButtonClick = (event) => {
    // When the new button is clicked, pass the event to the original click handler
    HandleTrackPlayPauseClick(event, order);
  };

  return (
    <div
      ref={mainDivRef}
      className={`group flex justify-between text-pink-swan p-2 rounded-md hover:text-white hover:bg-gray-800 transition delay-100 duration-300 ease-in-out overflow-hidden ${
        activeStatus ? 'text-white bg-gray-800' : ''
      }`}
      onFocus={() =>
        mainDivRef.current.classList.add('text-white', 'bg-gray-800')
      }
      onBlur={() =>
        mainDivRef.current.classList.remove('text-white', 'bg-gray-800')
      }
    >
      <div className="flex relative">
        <button
          className="group"
          onClick={handleButtonClick}
          aria-label="Play or Pause track"
        >
          <Image
            className="h-10 w-10 min-w-[2.5rem]  rounded-sm"
            src={song?.album?.images?.[0]?.url || noImage}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
          <span
            className={`pointer-events-none absolute inset-0 w-10 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ${
              activeStatus ? 'opacity-100' : ''
            }`}
          >
            {activeStatus ? (
              <PauseIcon
                className={`pointer-events-none absolute text-white top-2.5 left-[0.7rem] h-5 ${
                  activeStatus ? 'opacity-100' : ''
                }`}
              />
            ) : (
              <PlayIcon
                className={`pointer-events-none absolute text-white top-2.5 left-3 h-5 group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition delay-100 duration-300 ${
                  activeStatus ? 'opacity-100' : ''
                }`}
              />
            )}
          </span>
        </button>
        <div>
          <Link
            href={`/album/${song?.album?.id}`}
            className={` px-2 line-clamp-1 hover:underline focus:text-white focus:underline ${
              activeStatus ? 'text-green-500' : 'text-white'
            }`}
          >
            {song?.name}
          </Link>

          <div className=" px-2 line-clamp-1">
            {song?.artists?.map((artist, index) => (
              <span key={artist?.id}>
                {index > 0 && ', '}
                <Link
                  href={`/artist/${artist?.id}`}
                  className="hover:text-white hover:underline focus:text-white focus:underline truncate"
                >
                  {artist?.name}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="self-end xs:self-center">
        {millisToMinutesAndSeconds(song?.duration_ms)}
      </div>
    </div>
  );
};

export default TopSongCard;
