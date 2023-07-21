import React, { useState } from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { likedListState} from '@/atoms/songAtom';
// import component/icons
import LikedTrack from './likedTrack';

/**
 * Renders the list of tracks in an album
 * @function LikedTracks
 * @returns {JSX}
 */
function LikedTracks() {
  const likedTracklist = useRecoilValue (likedListState);
  return (
    <section>
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {likedTracklist?.items?.map((track, i) => (
          <LikedTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </section>
  );
}

export default LikedTracks;
