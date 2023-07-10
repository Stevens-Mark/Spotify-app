import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { songsListState } from '@/atoms/songAtom';
// import component/icons
import TitleAlbumTimeLabel from '@/components/headerLabels/titleAlbumTime';
import SongTrack from './songTrack';

/**
 * Renders the list of tracks from a search query
 * @function SongTracks
 * @returns {JSX}
 */
function SongTracks() {
  const songsList = useRecoilValue(songsListState);
  return (
    <section>
      <h2 className="sr-only">Track List</h2>
      <div className="sticky -top-2">
        <div className="grid grid-cols-2 text-pink-swan bg-black">
          <TitleAlbumTimeLabel />
        </div>
        <hr className="border-t-1 text-gray-400 mx-4 xs:mx-[1rem]" />
      </div>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {songsList?.map((track, i) => (
          <SongTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </section>
  );
}

export default SongTracks;
