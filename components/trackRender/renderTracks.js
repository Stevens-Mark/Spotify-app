import React from 'react';
import Image from 'next/image';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
import { getMonthDayYear } from '@/lib/time';
// import icon
import { PlayIcon, PauseIcon, HeartIcon } from '@heroicons/react/24/solid';
import Equaliser from '@/components/graphics/Equaliser';

/**
 * Handles the actual rendering of each track.
 * @function RenderTracks
 * @param {boolean} isShown whether to show/hide play/pause/equaliser on move rollover (see below)
 * @param {function} setIsShown set state for mouse rollover
 * @param {function} HandleTrackPlayPauseClick handle play/pause functionality
 * @param {number} order index/position in list
 * @param {boolean} activeStatus if playing or not set equalizer & play/pause icon
 * @param {object} song data
 * @param {string} addedAt date track added to list (just for playlists)
 * @param {string} collection sets a heart next to track in likesong list (currently just for show - DUMMY)
 * @returns {JSX}
 */
function RenderTracks({
  isShown,
  setIsShown,
  HandleTrackPlayPauseClick,
  order,
  activeStatus,
  song,
  addedAt,
  collection,
}) {
  return (
    <div
      className="grid grid-cols-2 text-pink-swan py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <button
          className="w-8 flex flex-shrink-0 justify-center"
          onClick={(event) => {
            HandleTrackPlayPauseClick(event, order);
          }}
        >
          {!isShown ? (
            activeStatus ? (
              <Equaliser />
            ) : (
              order + 1
            )
          ) : activeStatus ? (
            <PauseIcon className="h-3.5" />
          ) : (
            <PlayIcon className="h-3.5" />
          )}
        </button>
        {song?.album?.images?.[0].url && (
          <Image
            className="h-10 w-10"
            src={song?.album?.images?.[0].url}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="w-full">
          <h3
            className={`w-full sm:w-72 mdlg:w-36 lg:w-60 xl:w-80 2xl:w-[30rem] pr-2 ${
              activeStatus ? 'text-green-500' : 'text-white'
            } truncate`}
          >
            {song?.name}
          </h3>
          <h4 className="w-24 xxs:w-72 mdlg:w-36 lg:w-60 xl:w-80 2xl:w-[30rem] pr-2 truncate">
            {song?.artists?.[0].name}
          </h4>
        </div>
      </div>
      {song?.album?.name ? (
        <div className="flex items-end md:items-center justify-end mdlg:justify-between ml-auto md:ml-0">
          <span className="w-80 hidden mdlg:inline pr-3 truncate xl:whitespace-normal">
            {song?.album?.name}
          </span>
          {addedAt && (
            <span className="w-48 hidden mdlg:inline whitespace-nowrap">
              {getMonthDayYear(addedAt)}
            </span>
          )}
          <div className="flex items-center">

            {/**** DUMMY "like" heart to indicate part of likesongs list - currently NON FUNCTIONAL****/}
            {collection && <HeartIcon className="text-green-500 h-5 w-5" />}

            <span className="pl-5">
              {millisToMinutesAndSeconds(song?.duration_ms)}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-end xs:items-center justify-end ml-auto md:ml-0">
          <span className="pl-5">
            {millisToMinutesAndSeconds(song?.duration_ms)}
          </span>
        </div>
      )}
    </div>
  );
}

export default RenderTracks;
