import React from 'react';
import Image from 'next/image';
// import state management recoil
import { useRecoilValue } from 'recoil';
import {
  searchResultState,
  queryState,
  searchingState,
} from '@/atoms/searchAtom';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import component/icons
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayIcon } from '@heroicons/react/24/solid';

/**
 * Renders first 4 songs from search query next to top results
 * @function TopSongs
 * @returns {JSX}
 */
function TopSongs() {
  const queryResults = useRecoilValue(searchResultState);
  const songs = queryResults?.tracks?.items;

  return (
    <>
      <div
        className=" flex flex-col justify-between h-60 text-sm text-pink-swan px-4 py-2 rounded-lg cursor-pointer"
        // onMouseEnter={() => setIsShown(true)}
        // onMouseLeave={() => setIsShown(false)}
      >
        {/* 4 songs here */}
        {songs?.slice(0, 4).map((song, i) => (
          <div
            className=" group flex justify-between text-pink-swan p-2 rounded-md hover:text-white hover:bg-gray-800 transition delay-100 duration-300 ease-in-out overflow-hidden"
            key={song.id}
          >
            <div className="flex relative">
              <Image
                className="h-10 w-10 mr-2 rounded-sm"
                src={song.album?.images?.[0]?.url || noImage}
                alt=""
                width={100}
                height={100}
              />

              <span className="absolute inset-0 w-10  bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <PlayIcon className="absolute text-white top-2.5 left-3 h-5  group-hover:opacity-100 opacity-0 transition delay-100 duration-300 ease-in-out" />
              <div>
                <h3 className="w-36 xxs:w-60 md:w-80 pr-2 text-white truncate">{song.album.name}</h3>
                <p className="w-36 xxs:w-60 md:w-80 pr-2 truncate">{song.artists[0].name}</p>
              </div>
            </div>
            <span className='self-end xs:self-center'>{millisToMinutesAndSeconds(song.duration_ms)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default TopSongs;
