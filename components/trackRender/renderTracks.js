import React from 'react';
import Image from 'next/image';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
import { getMonthDayYear } from '@/lib/time';
// import icon
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import Equaliser from '@/components/graphics/Equaliser';

/**
 * Handles the actual rendering of each track.
 * @function RenderTracks
 * @param {boolean} isShown whether to show of not (see below)
 * @param {function} setIsShown set state for mouve rollover
 * @param {function} HandleTrackPlayPauseClick handle play/pause
 * @param {number} order index/posiotn in list
 * @param {boolean} activeStatus if playing or not set equalizer & play/pause icon
 * @param {number} currentSongIndex current playing position in the list
 * @param {object} song data
 * @returns
 */
function RenderTracks({
  isShown,
  setIsShown,
  HandleTrackPlayPauseClick,
  order,
  activeStatus,
  currentSongIndex,
  song,
}) {
  return (
    <div
      className="grid grid-cols-2 text-pink-swan py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <button
          className="w-2 md:w-4"
          onClick={(event) => {
            HandleTrackPlayPauseClick(event, order);
          }}
        >
          {!isShown ? (
            activeStatus && order == currentSongIndex ? (
              <Equaliser />
            ) : (
              order + 1
            )
          ) : activeStatus && order == currentSongIndex ? (
            <PauseIcon className="h-4" />
          ) : (
            <PlayIcon className="h-4" />
          )}
        </button>
        {song?.album?.images?.[0].url && (
          <Image
            className="h-10 w-10"
            src={song?.album?.images?.[0].url}
            alt=""
            width={100}
            height={100}
          />
        )}
        <div>
          <h3
            className={`w-36 sm:w-72 mdlg:w-36 lg:w-60 xl:w-80 pr-2 ${
              activeStatus && order == currentSongIndex
                ? 'text-green-500'
                : 'text-white'
            } truncate`}
          >
            {song?.name}
          </h3>
          <span className="w-40">{song?.artists?.[0].name}</span>
        </div>
      </div>
      {song?.album?.name ? (
        <div className="flex items-end md:items-center justify-end mdlg:justify-between ml-auto md:ml-0">
          <span className="w-40 hidden mdlg:inline pr-3">
            {song?.album?.name}
          </span>
          {song?.added_at && (
            <span className="w-48 hidden mdlg:inline">
              {getMonthDayYear(song?.added_at)}
            </span>
          )}
          <span className="pl-5">
            {millisToMinutesAndSeconds(song?.duration_ms)}
          </span>
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