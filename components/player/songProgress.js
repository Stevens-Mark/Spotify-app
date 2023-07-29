import React from 'react';
import { millisToMinutesAndSeconds } from '@/lib/time';

/**
 * @function SongProgress
 * @param {number} currentPosition of track in ms
 * @param {number} duration total duration of track in ms
 * @returns {JSX} progress bar in player
 */
function SongProgress({ currentPosition, duration }) {
  const progressPercentage = (currentPosition / duration) * 100;
  return (
    <div className="flex items-center w-full mt-1">
      {currentPosition ? (
        <span className="pr-2 text-xs md:text-base">
          {millisToMinutesAndSeconds(currentPosition)}
        </span>
      ) : (
        <span className="pr-2 text-xs md:text-base">0.00</span>
      )}

      <span className="mx-3 h-1 w-full rounded-md bg-pink-swan">
        <div
          className="h-1 rounded-md bg-white"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </span>
      {duration ? (
        <span className="pl-2 text-xs md:text-base">{millisToMinutesAndSeconds(duration)}</span>
      ) : (
        <span className="pl-2 text-xs md:text-base">0.00</span>
      )}
    </div>
  );
}

export default SongProgress;
