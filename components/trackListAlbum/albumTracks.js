import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { albumTrackListState } from '@/atoms/albumAtom';
// import component/icons
import AlbumTrack from './albumTrack';

/**
 * Renders the list of tracks in an album
 * @function AlbumTracks
 * @returns {JSX}
 */
function AlbumTracks() {
  const albumTracklist = useRecoilValue(albumTrackListState);

  return (
    <section className="pb-20">
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {albumTracklist?.tracks?.items?.map((track, i) => (
          <AlbumTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}
      </div>
    </section>
  );
}

export default AlbumTracks;
