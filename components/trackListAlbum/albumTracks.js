import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { albumTrackListState } from '@/atoms/albumAtom';
// import component/icons
import TitleTimeLabel from '../headerLabels/titleTime';
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
        <TitleTimeLabel />
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
