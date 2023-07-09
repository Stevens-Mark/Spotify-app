import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { songsListState } from '@/atoms/songAtom';
// import component/icons
import SongTrack from './songTrack';

/**
 * Renders the list of tracks from a search query
 * @function SongTracks
 * @returns {JSX}
 */
function SongTracks() {
  const songsList = useRecoilValue(songsListState);
  console.log("songslist", songsList)
  return (
    <section>
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {songsList?.tracks?.items?.map((track, i) => (
          <SongTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </section>
  );
}

export default SongTracks;
