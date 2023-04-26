import React from 'react';
import { useRecoilValue } from 'recoil';
import { ClockIcon } from '@heroicons/react/24/outline';
import { playListState } from '@/atoms/playListAtom';
import Song from './Song';

function Songs() {
  const playlist = useRecoilValue(playListState);

  return (
    <>
      <div className="grid grid-cols-2 text-gray-400 px-8  ">
        <span className="flex px-5">
          <p>#</p>
          <p className="w-36 lg:w-64 pl-2">Title</p>
        </span>
        <span className="flex justify-between ml-auto md:ml-0 pr-5">
          <p className="w-40 hidden md:inline">Album</p>
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
