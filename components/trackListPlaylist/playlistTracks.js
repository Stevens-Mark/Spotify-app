import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { playlistTrackListState } from '@/atoms/playListAtom';
// import component/icons
import PlaylistTrack from './playlistTrack';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * Renders the list of tracks of aplaylist
 * @function PlaylistTracks
 * @returns {JSX}
 */
function PlaylistTracks() {
  const playlistTracklist = useRecoilValue(playlistTrackListState);
  return (
    <>
      <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8">
        <span className="flex px-5">
          <p>#</p>
          <p className="w-36 lg:w-64 pl-2">Title</p>
        </span>
        <span className="flex justify-end mdlg:justify-between ml-auto md:ml-0 pr-5">
          <span className="w-40 hidden mdlg:inline pr-1">Album</span>
          <span className="w-48 hidden mdlg:inline pr-1">Date Added</span>
          <span className="flex items-center">
            <ClockIcon className="h-5 w-5 pr-1" />
            <span>Time</span>
          </span>
        </span>
      </div>
      <hr className="border-t-1 text-gray-400 mx4 xs:mx-12" />
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* playlist here */}
        {playlistTracklist?.tracks.items.map((track, i) => (
          <PlaylistTrack key={`${track.track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </>
  );
}

export default PlaylistTracks;
