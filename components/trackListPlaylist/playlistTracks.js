import React from 'react';
// import components
import PlaylistTrack from './playlistTrack';

/**
 * Renders the list of tracks of a playlist (user or other persons)
 * @function PlaylistTracks
 * @param {object} Tracklist from user or other person
 * @param {string} whichList either user playlist or null (so other person's playlist used)
 * @returns {JSX}
 */
function PlaylistTracks({ Tracklist, whichList }) {
  return (
    <section className="pb-20">
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {Tracklist?.tracks?.items?.map((track, i) => (
          <PlaylistTrack
            key={`${track?.track?.id}-${i}`}
            track={track}
            order={i}
            whichList={whichList}
          />
        ))}
      </div>
    </section>
  );
}

export default PlaylistTracks;
