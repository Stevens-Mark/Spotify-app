import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { artistTrackListState } from '@/atoms/artistAtom';
// import component/icons
import { ClockIcon } from '@heroicons/react/24/outline';
import ArtistTrack from './artistTrack';

/**
 * Renders the list of tracks from an artist
 * @function ArtistTracks
 * @returns {JSX}
 */
function ArtistTracks() {
  const artistTracklist = useRecoilValue(artistTrackListState);

  return (
    <>
      <div className="grid grid-cols-2 text-pink-swan px-8  ">
        <span className="flex px-5">
          <p>#</p>
          <p className="w-36 lg:w-64 pl-2">Popular</p>
        </span>
        <span className="flex justify-end ml-auto md:ml-0 pr-5">
          <span className="flex items-center">
            <ClockIcon className="h-5 w-5 pr-1" />
            <p>Time</p>
          </span>
        </span>
      </div>
      <hr className="border-t-1 text-gray-400 mx-12" />
      <div className="p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* artist track list here */}
        {artistTracklist?.tracks.map((track, i) => (
          <ArtistTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </>
  );
}

export default ArtistTracks;
