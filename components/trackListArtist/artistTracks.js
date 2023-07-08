import React, { useState } from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { artistTrackListState } from '@/atoms/artistAtom';
// import component/icons
import ArtistTrack from './artistTrack';

/**
 * Renders the list of tracks from an artist
 * @function ArtistTracks
 * @returns {JSX}
 */
function ArtistTracks() {
  const artistTracklist = useRecoilValue(artistTrackListState);
  const [number, setNumber] = useState(5);

  const toggleNumber = () => {
    const newNumber = number === 5 ? 10 : 5;
    setNumber(newNumber);
  };

  return (
    <section>
      <h2 className="sr-only">Track List</h2>
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {artistTracklist?.tracks?.slice(0, number).map((track, i) => (
          <ArtistTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}

        <button
          className="self-start mt-3 px-5 text-sm md:text-xl text-white hover:text-green-500"
          onClick={toggleNumber}
        >
          {number === 5 ? 'See More' : 'See Less'}
        </button>
      </div>
    </section>
  );
}

export default ArtistTracks;
