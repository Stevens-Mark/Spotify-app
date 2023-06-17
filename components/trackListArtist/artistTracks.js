import React, { useState } from 'react';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { artistTrackListState } from '@/atoms/artistAtom';
// import component/icons
import { ClockIcon } from '@heroicons/react/24/outline';
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
    <>
      <h2 className="text-white px-5 pb-6 xs:px-14 text-xl md:text-2xl xl:text-3xl">
        Popular
      </h2>
      <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8">
        <span className="flex px-5">
          <span>#</span>
          <span className="w-36 lg:w-64 pl-2">Title</span>
        </span>
        <span className="flex justify-end ml-auto md:ml-0 pr-5">
          <span className="flex items-center">
            <ClockIcon className="h-5 w-5 pr-1" />
            <span>Time</span>
          </span>
        </span>
      </div>
      <hr className="border-t-1 text-gray-400 mx-4 xs:mx-12" />
      <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
        {/* artist track list here */}
        {artistTracklist?.tracks?.slice(0, number).map((track, i) => (
          <ArtistTrack key={`${track.id}-${i}`} track={track} order={i} />
        ))}

        <button className='self-start mt-3 px-5 text-sm md:text-xl text-white hover:text-green-500' onClick={toggleNumber}>
          {number === 5 ? 'See More' : 'See Less'}
        </button>
      </div>
    </>
  );
}

export default ArtistTracks;
