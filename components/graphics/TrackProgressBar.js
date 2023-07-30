import React from 'react';
import { getMonthYear, msToTime } from '@/lib/time';

/**
 * @function TrackProgressBar
 * @param {*} currentPosition of track in ms
 * @param {*} episode information
 * @returns {JSX} progress bar in episode card & individual episode page
 */
const TrackProgressBar = ({ currentPosition, episode}) => {
  const progressPercentage = (currentPosition / episode?.duration_ms) * 100;

  return (
    <>
      <span className="line-clamp-1">
        {getMonthYear(episode?.release_date)}&nbsp;•&nbsp;
      </span>
      <span className="line-clamp-1">
        {msToTime(episode?.duration_ms - currentPosition)}
        {episode?.resume_point?.fully_played ? '' : ' left'}
      </span>

      <div className="mx-3 h-1 w-20 rounded-md bg-pink-swan hidden xs:inline md:hidden lg:inline">
        <div
          className="h-1 rounded-md bg-white"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </>
  );
};

export default TrackProgressBar;
