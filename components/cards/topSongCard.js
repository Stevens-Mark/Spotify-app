import React from 'react';
import Image from 'next/image';
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
  return (
    <div
      className={`group flex justify-between text-pink-swan p-2 rounded-md hover:text-white hover:bg-gray-800 transition delay-100 duration-300 ease-in-out overflow-hidden ${
        activeStatus ? 'text-white bg-gray-800' : ''
      }`}
      onClick={(event) => {
        HandleTrackPlayPauseClick(event, order);
      }}
    >
      <div className="flex relative">
        <Image
          className="h-10 w-10 mr-2 rounded-sm"
          src={song?.album?.images?.[0]?.url || noImage}
          alt=""
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
        <span
          className={`absolute inset-0 w-10 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            activeStatus ? 'opacity-100' : ''
          }`}
        />

        {activeStatus ? (
          <PauseIcon
            className={`absolute text-white top-2.5 left-3 h-5 ${
              activeStatus ? 'opacity-100' : ''
            }`}
          />
        ) : (
          <PlayIcon
            className={`absolute text-white top-2.5 left-3 h-5 group-hover:opacity-100 opacity-0 transition delay-100 duration-300 ${
              activeStatus ? 'opacity-100' : ''
            }`}
          />
        )}

        <div>
          <h3
            className={`w-36 xxs:w-60 md:w-80 pr-2 truncate ${
              activeStatus? 'text-green-500' : 'text-white'
            }`}
          >
            {song?.name}
          </h3>
          <p className="w-36 xxs:w-60 md:w-80 pr-2 truncate">
            {song?.artists?.[0].name}
          </p>
        </div>
      </div>
      <span className="self-end xs:self-center">
        {millisToMinutesAndSeconds(song?.duration_ms)}
      </span>
    </div>
  );
};

export default TopSongCard;
