import React from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { playlistTrackListState } from '@/atoms/playListAtom';
// import components
import PlaylistTrack from './playlistTrack';

/**
 * Renders the list of tracks of a playlist (user or other persons)
 * @function PlaylistTracks
 * @returns {JSX}
 */
function PlaylistTracks() {
  const playlistTracklist = useRecoilValue(playlistTrackListState);
  console.log('Playlisttracks ', playlistTracklist);
  return (
    <section>
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {playlistTracklist?.tracks?.items?.map((track, i) => (
          <PlaylistTrack
            key={`${track?.track?.id}-${i}`}
            track={track}
            order={i}
          />
        ))}
      </div>
    </section>
  );
}

export default PlaylistTracks;
