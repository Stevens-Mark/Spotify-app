import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { playlistTrackListState } from '@/atoms/playListAtom';
// import component/icons
import TitleAlbumDateTimeLabel from '../headerLabels/titleAlbumDateTime';
import PlaylistTrack from './playlistTrack';

/**
 * Renders the list of tracks of a playlist
 * @function PlaylistTracks
 * @returns {JSX}
 */
function PlaylistTracks() {
  const playlistTracklist = useRecoilValue(playlistTrackListState);
  return (
    <>
      <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8">
        <TitleAlbumDateTimeLabel />
      </div>
      <hr className="border-t-1 text-gray-400 mx4 xs:mx-12" />
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* playlist here */}
        {playlistTracklist?.tracks.items.map((track, i) => (
          <PlaylistTrack
            key={`${track.track.id}-${i}`}
            track={track}
            order={i}
          />
        ))}
      </div>
    </>
  );
}

export default PlaylistTracks;
