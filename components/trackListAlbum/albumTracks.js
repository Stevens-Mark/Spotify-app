import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { albumTrackListState } from '@/atoms/albumAtom';
// import component/icons
import { ClockIcon } from '@heroicons/react/24/outline';
import AlbumTrack from './albumTrack';

/**
 * Renders the list of tracks in an album
 * @function AlbumTracks
 * @returns {JSX}
 */
function AlbumTracks() {
  const albumTracklist = useRecoilValue(albumTrackListState);

  return (
    <>
      <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8">
        <span className="flex px-5">
          <span>#</span>
          <span className="w-36 lg:w-64 pl-2">Title</span>
        </span>
        <span className="flex justify-end ml-auto md:ml-0 pr-5">
          <span className="flex items-center">
            <ClockIcon className="h-5 w-5 pr-1" />
            <span>Time</span>
          </span>
        </span>
      </div>
      <hr className="border-t-1 text-gray-400 mx-4 xs:mx-12" />
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* album track list here */}
        {albumTracklist?.tracks.items.map((track, i) => (
          <AlbumTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </>
  );
}

export default AlbumTracks;
