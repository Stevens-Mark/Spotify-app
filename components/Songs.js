import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { playlistState } from '@/atoms/playListAtom';
// import component/icons
import Song from './Song';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * Renders the list of tracks in playlist
 * @function SongS
 * @returns {JSX}
 */
function Songs() {
  const playlist = useRecoilValue(playlistState);
  return (
    <>
      <div className="grid grid-cols-2 text-pink-swan px-8  ">
        <span className="flex px-5">
          <p>#</p>
          <p className="w-36 lg:w-64 pl-2">Title</p>
        </span>
        <span className="flex justify-end custombreakpoint:justify-between ml-auto md:ml-0 pr-5">
          <p className="w-40 hidden custombreakpoint:inline pr-1">Album</p>
          <p className="w-48 hidden custombreakpoint:inline pr-1">Date Added</p>
          <span className="flex items-center">
            <ClockIcon className="h-5 w-5 pr-1" />
            <p>Time</p>
          </span>
        </span>
      </div>
      <hr className="border-t-1 text-gray-400 mx-12" />
      <div className="p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* song playlist here */}
        {playlist?.tracks.items.map((track, i) => (
          <Song key={`${track.track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </>
  );
}

export default Songs;
