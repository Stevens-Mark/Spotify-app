import React from 'react';
// import components
import TitleAlbumDateTimeLabel from '../headerLabels/titleAlbumDateTime';
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
    <>
      <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8">
        <TitleAlbumDateTimeLabel />
      </div>
      <hr className="border-t-1 text-gray-400 mx-4 xs:mx-[2.1rem]" />
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* playlist here */}
        {Tracklist?.tracks?.items?.map((track, i) => (
          <PlaylistTrack
            key={`${track?.track?.id}-${i}`}
            track={track}
            order={i}
            whichList={whichList}
          />
        ))}
      </div>
    </>
  );
}

export default PlaylistTracks;
