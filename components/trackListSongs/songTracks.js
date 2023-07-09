import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { songsListState } from '@/atoms/songAtom';
// import component/icons
import AlbumTrack from './albumTrack';

/**
 * Renders the list of tracks from a search query
 * @function SongTracks
 * @returns {JSX}
 */
function SongTracks() {
  const songslist = useRecoilValue(songsListState);

  return (
    <section>
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {songslist?.tracks?.items?.map((track, i) => (
          <AlbumTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </section>
  );
}

export default SongTracks;
