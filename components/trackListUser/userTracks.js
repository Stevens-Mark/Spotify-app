import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { myPlaylistState } from '@/atoms/playListAtom';
// import component/icons
import TitleAlbumDateTimeLabel from '../headerLabels/titleAlbumDateTime';
import UserTrack from './userTrack';

/**
 * Renders the list of tracks in user's playlist
 * @function UserTracks
 * @returns {JSX}
 */
function UserTracks() {
  const myPlaylist = useRecoilValue(myPlaylistState);
  return (
    <>
      <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8">
        <TitleAlbumDateTimeLabel />
      </div>
      <hr className="border-t-1 text-gray-400 mx-4 xs:mx-12" />
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* user's playlist tracks here */}
        {myPlaylist?.tracks.items.map((track, i) => (
          <UserTrack key={`${track.track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </>
  );
}

export default UserTracks;
